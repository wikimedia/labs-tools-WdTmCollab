/**
 * Rate Limit Information extracted from response headers
 */
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
  isLimited: boolean;
}

/**
 * Rate limit status for UI feedback
 */
export interface RateLimitStatus {
  isLimited: boolean;
  remaining: number;
  limit: number;
  resetIn: number; // milliseconds until reset
  message: string;
}

/**
 * Parse rate limit headers from response
 * @param response - The fetch Response object
 * @returns RateLimitInfo object with parsed headers
 */
export function parseRateLimitHeaders(response: Response): RateLimitInfo {
  const limit = parseInt(response.headers.get("x-ratelimit-limit") || "0", 10);
  const remaining = parseInt(response.headers.get("x-ratelimit-remaining") || "0", 10);
  const reset = parseInt(response.headers.get("x-ratelimit-reset") || "0", 10);
  const retryAfter = parseInt(response.headers.get("retry-after") || "0", 10);

  return {
    limit,
    remaining,
    reset,
    retryAfter,
    isLimited: response.status === 429,
  };
}

/**
 * Calculate exponential backoff delay with jitter
 * @param attempt - The attempt number (0-based)
 * @param maxAttempts - Maximum number of attempts
 * @param baseDelay - Base delay in milliseconds
 * @returns Delay in milliseconds
 */
export function calculateExponentialBackoff(
  attempt: number,
  maxAttempts: number = 5,
  baseDelay: number = 1000
): number {
  // Don't retry beyond max attempts
  if (attempt >= maxAttempts) {
    return 0;
  }

  // Exponential backoff: baseDelay * 2^attempt
  const exponentialDelay = baseDelay * Math.pow(2, attempt);

  // Add jitter (random value between 0 and 25% of exponential delay)
  const jitter = Math.random() * (exponentialDelay * 0.25);

  // Cap at 30 seconds
  const maxDelay = 30000;
  return Math.min(exponentialDelay + jitter, maxDelay);
}

/**
 * Retry a fetch request with exponential backoff
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @param maxRetries - Maximum number of retries
 * @returns The response and rate limit info
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries: number = 3
): Promise<{ response: Response; rateLimitInfo: RateLimitInfo }> {
  let lastError: Error | null = null;
  let rateLimitInfo: RateLimitInfo = {
    limit: 0,
    remaining: 0,
    reset: 0,
    isLimited: false,
  };

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      rateLimitInfo = parseRateLimitHeaders(response);

      // If not rate limited or successful, return immediately
      if (response.status !== 429 && response.ok) {
        return { response, rateLimitInfo };
      }

      // If rate limited and we have retry attempts left
      if (response.status === 429 && attempt < maxRetries) {
        const delay = rateLimitInfo.retryAfter
          ? rateLimitInfo.retryAfter * 1000
          : calculateExponentialBackoff(attempt, maxRetries + 1);

        console.warn(
          `Rate limited. Attempt ${attempt + 1}/${maxRetries + 1}. Retrying in ${delay}ms`
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // If not rate limited but not OK, return the response
      if (!response.ok) {
        return { response, rateLimitInfo };
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // If not the last attempt, wait before retrying
      if (attempt < maxRetries) {
        const delay = calculateExponentialBackoff(attempt, maxRetries + 1);
        console.warn(
          `Network error: ${lastError.message}. Attempt ${attempt + 1}/${maxRetries + 1}. Retrying in ${delay}ms`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
    }
  }

  // If we've exhausted all retries, throw the last error or return last response
  if (lastError) {
    throw lastError;
  }

  // Should not reach here, but return a response anyway
  return { response: new Response(null, { status: 500 }), rateLimitInfo };
}

/**
 * Format rate limit status for user display
 * @param rateLimitInfo - Rate limit information
 * @returns Formatted status object for UI
 */
export function formatRateLimitStatus(rateLimitInfo: RateLimitInfo): RateLimitStatus {
  const now = Date.now();
  const resetTime = rateLimitInfo.reset * 1000; // Convert to milliseconds
  const resetIn = Math.max(0, resetTime - now);

  let message = "";
  if (rateLimitInfo.isLimited) {
    const seconds = Math.ceil(resetIn / 1000);
    message = `Rate limit exceeded. Please try again in ${seconds} seconds.`;
  } else if (rateLimitInfo.remaining < rateLimitInfo.limit * 0.2) {
    message = `Warning: Only ${rateLimitInfo.remaining} requests remaining.`;
  }

  return {
    isLimited: rateLimitInfo.isLimited,
    remaining: rateLimitInfo.remaining,
    limit: rateLimitInfo.limit,
    resetIn,
    message,
  };
}

/**
 * Check if response contains deprecation warning
 * @param response - The fetch Response object
 * @returns Deprecation warning message or null
 */
export function parseDeprecationHeader(response: Response): string | null {
  const deprecationHeader = response.headers.get("deprecation");
  const sunsetHeader = response.headers.get("sunset");
  const warningHeader = response.headers.get("warning");

  if (deprecationHeader === "true") {
    return warningHeader || "This API endpoint is deprecated and will be removed in the future.";
  }

  if (sunsetHeader) {
    return `This API endpoint will be sunset on ${sunsetHeader}. Please migrate to v2 endpoints.`;
  }

  return null;
}

/**
 * Create a response with rate limit context
 */
export interface FetchResponse<T> {
  data: T | null;
  error: Error | null;
  rateLimitInfo: RateLimitInfo;
  deprecationWarning: string | null;
  status: number;
}

/**
 * Enhanced fetch wrapper for API calls with full rate limit and deprecation handling
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @param maxRetries - Maximum retry attempts
 * @returns Enhanced response with rate limit and deprecation info
 */
export async function fetchWithContext<T = any>(
  url: string,
  options: RequestInit = {},
  maxRetries: number = 3
): Promise<FetchResponse<T>> {
  try {
    const { response, rateLimitInfo } = await fetchWithRetry(url, options, maxRetries);
    const deprecationWarning = parseDeprecationHeader(response);

    if (!response.ok) {
      return {
        data: null,
        error: new Error(`HTTP ${response.status}: ${response.statusText}`),
        rateLimitInfo,
        deprecationWarning,
        status: response.status,
      };
    }

    const data = await response.json();

    // Log deprecation warnings to console
    if (deprecationWarning) {
      console.warn("Deprecation Warning:", deprecationWarning);
    }

    return {
      data,
      error: null,
      rateLimitInfo,
      deprecationWarning,
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
      rateLimitInfo: {
        limit: 0,
        remaining: 0,
        reset: 0,
        isLimited: false,
      },
      deprecationWarning: null,
      status: 0,
    };
  }
}
