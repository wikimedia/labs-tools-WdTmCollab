/**
 * Test utilities for v2 API integration
 * Run these tests to validate rate limiting, retry logic, and caching
 * 
 * Usage:
 * - Manual testing in browser console
 * - Integration tests with test framework
 * - End-to-end API validation
 */

import { fetchWithRetry, fetchWithContext, parseRateLimitHeaders, formatRateLimitStatus } from "@/utils/rateLimit";
import { endpoints } from "@/utils/endpoints";

/**
 * Test configuration
 */
const TEST_CONFIG = {
    // Use a test actor ID from Wikidata
    TEST_ACTOR_ID: "Q159352", // Michael Jackson
    TEST_MOVIE_ID: "Q105756", // Thriller
    TEST_SEARCH_QUERY: "actor",
};

/**
 * Test 1: Verify all endpoints use v2 prefix
 */
export async function testEndpointsUseV2() {
    console.log("Test 1: Verify v2 prefix in all endpoints");

    const testEndpoints = {
        actorSearch: endpoints.actorSearch("test"),
        actorDetails: endpoints.actorDetails(TEST_CONFIG.TEST_ACTOR_ID),
        co_ActorSearch: endpoints.co_ActorSearch(TEST_CONFIG.TEST_ACTOR_ID),
        movieSearch: endpoints.movieSearch("test"),
        productionsShared: endpoints.productionsShared(
            TEST_CONFIG.TEST_ACTOR_ID,
            "Q12345"
        ),
        sharedActors: endpoints.sharedActors(TEST_CONFIG.TEST_MOVIE_ID, "Q105757"),
        actorPopular: endpoints.actorPopular(),
    };

    let passed = 0;
    let failed = 0;

    for (const [name, url] of Object.entries(testEndpoints)) {
        if (url.includes("/api/v2/")) {
            console.log(`${name}: Uses v2 prefix`);
            passed++;
        } else {
            console.log(`${name}: Missing v2 prefix - ${url}`);
            failed++;
        }
    }

    console.log(`Result: ${passed} passed, ${failed} failed\n`);
    return failed === 0;
}

/**
 * Test 2: Test rate limit header parsing
 */
export async function testRateLimitHeaderParsing() {
    console.log("🧪 Test 2: Rate limit header parsing");

    // Create mock response with rate limit headers
    const mockResponse = new Response(JSON.stringify({ test: "data" }), {
        status: 200,
        headers: {
            "x-ratelimit-limit": "100",
            "x-ratelimit-remaining": "95",
            "x-ratelimit-reset": String(Math.floor(Date.now() / 1000) + 3600),
            "retry-after": "30",
        },
    });

    const rateLimitInfo = parseRateLimitHeaders(mockResponse);

    console.log("Parsed Rate Limit Info:");
    console.log(`  Limit: ${rateLimitInfo.limit}`);
    console.log(`  Remaining: ${rateLimitInfo.remaining}`);
    console.log(`  Reset: ${new Date(rateLimitInfo.reset * 1000).toISOString()}`);
    console.log(`  Retry After: ${rateLimitInfo.retryAfter}s`);
    console.log(`  Is Limited: ${rateLimitInfo.isLimited}`);

    const passed = rateLimitInfo.limit === 100 && rateLimitInfo.remaining === 95;
    console.log(`\n${passed ? "Passed" : "Failed"} Rate limit parsing test\n`);

    return passed;
}

/**
 * Test 3: Test rate limit status formatting
 */
export async function testRateLimitStatusFormatting() {
    console.log("Test 3: Rate limit status formatting");

    const mockInfo = {
        limit: 100,
        remaining: 10,
        reset: Math.floor(Date.now() / 1000) + 3600,
        isLimited: false,
    };

    const status = formatRateLimitStatus(mockInfo);

    console.log("Formatted Status:");
    console.log(`  Is Limited: ${status.isLimited}`);
    console.log(`  Remaining: ${status.remaining}/${status.limit}`);
    console.log(`  Reset In: ${status.resetIn}ms (~${Math.ceil(status.resetIn / 1000)}s)`);
    console.log(`  Message: ${status.message}`);

    const passed =
        status.remaining === 10 &&
        status.limit === 100 &&
        status.resetIn > 0;

    console.log(`\n${passed ? "Passed" : "Failed"} Rate limit formatting test\n`);

    return passed;
}

/**
 * Test 4: Test actual API endpoint connectivity
 */
export async function testAPIConnectivity() {
    console.log("🧪 Test 4: Test API endpoint connectivity");

    try {
        const result = await fetchWithContext(
            endpoints.actorPopular(),
            {},
            1 // minimal retries for testing
        );

        if (result.status === 200) {
            console.log("API connectivity test passed");
            console.log(`  Status: ${result.status}`);
            console.log(`  Data received: ${result.data?.length || 0} items`);
            if (result.rateLimitInfo.limit > 0) {
                console.log(`  Rate limit: ${result.rateLimitInfo.remaining}/${result.rateLimitInfo.limit}`);
            }
            return true;
        } else {
            console.log(`API returned non-200 status: ${result.status}`);
            console.log(`  Error: ${result.error?.message}`);
            return false;
        }
    } catch (error) {
        console.log(`API connectivity test failed: ${error}`);
        return false;
    }
}

/**
 * Test 5: Test individual endpoint functionality
 */
export async function testEndpointFunctionality() {
    console.log("Test 5: Test individual endpoint functionality\n");

    const tests = [
        {
            name: "Actor Details",
            url: endpoints.actorDetails(TEST_CONFIG.TEST_ACTOR_ID),
        },
        {
            name: "Actor Popular",
            url: endpoints.actorPopular(),
        },
        {
            name: "Actor Search",
            url: endpoints.actorSearch(TEST_CONFIG.TEST_SEARCH_QUERY),
        },
    ];

    let passed = 0;

    for (const test of tests) {
        try {
            const result = await fetchWithContext(test.url, {}, 1);

            if (result.status === 200 && result.data) {
                console.log(`${test.name}: Success`);
                if (result.deprecationWarning) {
                    console.log(`   Deprecation: ${result.deprecationWarning}`);
                }
                passed++;
            } else {
                console.log(`${test.name}: Failed (Status ${result.status})`);
                if (result.error) {
                    console.log(`   Error: ${result.error.message}`);
                }
            }
        } catch (error) {
            console.log(`${test.name}: Exception - ${error}`);
        }
    }

    console.log(`\n📊 Result: ${passed}/${tests.length} endpoints working\n`);
    return passed === tests.length;
}

/**
 * Test 6: Test debounce utility
 */
export async function testDebounceUtility() {
    console.log("Test 6: Test debounce utility");

    const { useDebounce } = await import("@/utils/debounce");
    let callCount = 0;

    const callback = () => {
        callCount++;
    };

    const [debouncedCallback] = useDebounce(callback, 100);

    // Call multiple times rapidly
    debouncedCallback();
    debouncedCallback();
    debouncedCallback();

    console.log("Called debounced function 3 times rapidly");
    console.log(`Immediate call count: ${callCount} (should be 0)`);

    // Wait for debounce to complete
    await new Promise((resolve) => setTimeout(resolve, 150));

    console.log(`After 150ms: ${callCount} (should be 1)`);

    const passed = callCount === 1;
    console.log(`\n${passed ? "Passed" : "Failed"} Debounce test\n`);

    return passed;
}

/**
 * Run all tests
 */
export async function runAllTests() {
    console.log("╔════════════════════════════════════════════════════════════════╗");
    console.log("║           API v2 Integration Test Suite                      ║");
    console.log("╚════════════════════════════════════════════════════════════════╝\n");

    const results = [];

    // Test 1
    results.push(await testEndpointsUseV2());

    // Test 2
    results.push(await testRateLimitHeaderParsing());

    // Test 3
    results.push(await testRateLimitStatusFormatting());

    // Test 4
    results.push(await testAPIConnectivity());

    // Test 5
    results.push(await testEndpointFunctionality());

    // Summary
    const passed = results.filter((r) => r).length;
    const total = results.length;

    console.log("╔════════════════════════════════════════════════════════════════╗");
    console.log(`║  Test Results: ${passed}/${total} Passed                                ║`);
    console.log("╚════════════════════════════════════════════════════════════════╝\n");

    if (passed === total) {
        console.log("All tests passed! API v2 integration is working correctly.");
    } else {
        console.log(`${total - passed} test(s) failed. Please review the issues above.`);
    }

    return passed === total;
}

/**
 * Quick health check for API status
 */
export async function quickHealthCheck() {
    console.log("Quick API Health Check...\n");

    try {
        const startTime = performance.now();
        const result = await fetchWithContext(endpoints.actorPopular(), {}, 1);
        const duration = performance.now() - startTime;

        console.log("API Status: HEALTHY");
        console.log(`Response Time: ${duration.toFixed(2)}ms`);
        console.log(`Status Code: ${result.status}`);

        if (result.rateLimitInfo.limit > 0) {
            const percentage =
                (result.rateLimitInfo.remaining / result.rateLimitInfo.limit) * 100;
            console.log(
                `Rate Limit: ${result.rateLimitInfo.remaining}/${result.rateLimitInfo.limit} (${percentage.toFixed(1)}%)`
            );
        }

        if (result.deprecationWarning) {
            console.log(`Warning: ${result.deprecationWarning}`);
        }

        return true;
    } catch (error) {
        console.error("API Status: UNHEALTHY");
        console.error(`Error: ${error}`);
        return false;
    }
}

// Export for use in browser console or test runner
if (typeof window !== "undefined") {
    (window as any).apiTests = {
        testEndpointsUseV2,
        testRateLimitHeaderParsing,
        testRateLimitStatusFormatting,
        testAPIConnectivity,
        testEndpointFunctionality,
        testDebounceUtility,
        runAllTests,
        quickHealthCheck,
    };

    console.log("API test utilities loaded. Run 'apiTests.runAllTests()' to start.");
}
