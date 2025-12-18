"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState, useCallback, useEffect } from "react";
import { endpoints } from "@/utils/endpoints";
import {
  fetchWithContext,
  formatRateLimitStatus,
  RateLimitStatus,
} from "@/utils/rateLimit";
import { useDebounce } from "@/utils/debounce";

// --- Types ---
export interface Actor {
  id: string;
  label: string;
  description?: string;
  url: string;
  imageUrl?: string;
}

export interface ActorDetail {
  id: string;
  name: string;
  bio?: string | null;
  imageUrl?: string | null;
  dateOfBirth?: string | null;
  placeOfBirth?: string | null;
  countryOfCitizenship?: string | null;
  gender?: string | null;
  occupations?: string[] | null;
  productions: any[];
  awards?: any[];
  website?: string | null;
  coActors?: any[];
}

// --- Hooks ---

/**
 * HOOK: useActorSearch
 * Searches for actors with debouncing and handles API rate limits.
 */
export function useActorSearch(query: string) {
  const [rateLimitStatus, setRateLimitStatus] = useState<RateLimitStatus | null>(
    null
  );
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce the query input to avoid spamming the API
  const [debouncedCallback] = useDebounce(
    useCallback((q: string) => {
      setDebouncedQuery(q);
    }, []),
    300 // 300ms delay
  );

  useEffect(() => {
    debouncedCallback(query);
  }, [query, debouncedCallback]);

  return {
    ...useQuery<Actor[]>({
      queryKey: ["actorSearch", debouncedQuery],
      queryFn: async () => {
        // Don't fetch if query is too short
        if (!debouncedQuery || debouncedQuery.length < 2) return [];

        const result = await fetchWithContext<any>(
          endpoints.actorSearch(debouncedQuery),
          {},
          3
        );

        if (result.rateLimitInfo.limit > 0) {
          setRateLimitStatus(formatRateLimitStatus(result.rateLimitInfo));
        }

        if (result.deprecationWarning) {
          console.warn("Deprecation Notice:", result.deprecationWarning);
        }

        if (result.error) throw result.error;

        // FIX: Unwrap 'results' if the API returns { results: [...] }
        return result.data?.results || result.data || [];
      },
      enabled: debouncedQuery.length >= 2,
      staleTime: 5 * 60 * 1000,
    }),
    rateLimitStatus,
  };
}

/**
 * HOOK: useActorDetails
 * Fetches detailed information for a specific actor.
 */
export function useActorDetails(actorId: string) {
  const [rateLimitStatus, setRateLimitStatus] = useState<RateLimitStatus | null>(
    null
  );

  return {
    ...useQuery<ActorDetail>({
      queryKey: ["actorDetails", actorId],
      queryFn: async () => {
        const result = await fetchWithContext<any>(
          endpoints.actorDetails(actorId),
          {},
          3
        );

        if (result.rateLimitInfo.limit > 0) {
          setRateLimitStatus(formatRateLimitStatus(result.rateLimitInfo));
        }

        if (result.error) throw result.error;

        const raw = result.data;
        // Handle case where API might return an array or single object
        return Array.isArray(raw) ? raw[0] : raw;
      },
      enabled: !!actorId,
    }),
    rateLimitStatus,
  };
}

/**
 * HOOK: useCoActors
 * Fetches co-actors with pagination.
 */
export function useCoActors(actorId: string, page: number, limit: number) {
  const offset = (page - 1) * limit;
  const [rateLimitStatus, setRateLimitStatus] = useState<RateLimitStatus | null>(
    null
  );

  return {
    ...useQuery({
      queryKey: ["coActors", actorId, page, limit],
      queryFn: async () => {
        const url = `${endpoints.co_ActorSearch(
          actorId
        )}&limit=${limit}&offset=${offset}`;
        const result = await fetchWithContext(url, {}, 3);

        if (result.rateLimitInfo.limit > 0) {
          setRateLimitStatus(formatRateLimitStatus(result.rateLimitInfo));
        }

        if (result.error) throw result.error;

        // FIX: Unwrap 'results' array
        return result.data?.results || result.data || [];
      },
      enabled: !!actorId,
      placeholderData: keepPreviousData,
      staleTime: 5 * 60 * 1000,
    }),
    rateLimitStatus,
  };
}

/**
 * HOOK: usePopularActors
 * Fetches popular actors for the homepage.
 */
export function usePopularActors() {
  const [rateLimitStatus, setRateLimitStatus] = useState<RateLimitStatus | null>(
    null
  );

  return {
    ...useQuery({
      queryKey: ["popularActors"],
      queryFn: async () => {
        const result = await fetchWithContext(
          endpoints.actorPopular(),
          {},
          3
        );

        if (result.rateLimitInfo.limit > 0) {
          setRateLimitStatus(formatRateLimitStatus(result.rateLimitInfo));
        }

        if (result.error) throw result.error;

        // FIX: Unwrap 'results' array
        // The API returns { results: [...], pagination: {...} }
        return result.data?.results || result.data || [];
      },
      staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    }),
    rateLimitStatus,
  };
}