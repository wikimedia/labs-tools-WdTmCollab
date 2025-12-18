import { useQuery } from "@tanstack/react-query";
import React, { useState, useCallback } from "react";
import { endpoints } from "@/utils/endpoints";
import { fetchWithContext, formatRateLimitStatus, RateLimitStatus } from "@/utils/rateLimit";
import { useDebounce } from "@/utils/debounce";
import { ReactNode } from "react";

// --- Types ---
export interface Movie {
  year: ReactNode;
  id: string;
  label: string;
  description?: string;
  type: string;
  url: string;
  imageUrl?: string;
}

export interface Production {
  id?: string;
  title: string;
  description: string;
  image?: string | null;
  logo?: string | null;
  wikipedia?: string;
  publicationDate?: string;
}

export interface SharedActor {
  id: string;
  name: string;
  description?: string;
  image?: string;
  sharedWorks?: string;
  awardCount?: string;
}

// --- Hooks ---

// 1. Search Movies/TV (for the Compare Page)
export function useMovieSearch(query: string) {
  const [rateLimitStatus, setRateLimitStatus] = useState<RateLimitStatus | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [debouncedCallback] = useDebounce(
    useCallback((q: string) => {
      setDebouncedQuery(q);
    }, []),
    300 // 300ms debounce delay for search
  );

  React.useEffect(() => {
    debouncedCallback(query);
  }, [query, debouncedCallback]);

  return {
    ...useQuery<Movie[]>({
      queryKey: ["movieSearch", debouncedQuery],
      queryFn: async () => {
        const result = await fetchWithContext<Movie[]>(
          endpoints.movieSearch(debouncedQuery),
          {},
          3
        );

        // Update rate limit status
        if (result.rateLimitInfo.limit > 0) {
          setRateLimitStatus(formatRateLimitStatus(result.rateLimitInfo));
        }

        if (result.error) throw result.error;
        return result.data || [];
      },
      enabled: debouncedQuery.length > 2,
      staleTime: 5 * 60 * 1000,
    }),
    rateLimitStatus,
  };
}

// 2. Shared Productions (For Productions Page)
// "Find all movies shared between Actor A and Actor B"
export function useSharedProductions(actor1Id: string | undefined, actor2Id: string | undefined) {
  const [rateLimitStatus, setRateLimitStatus] = useState<RateLimitStatus | null>(null);

  return {
    ...useQuery<Production[]>({
      queryKey: ["sharedProductions", actor1Id, actor2Id],
      queryFn: async () => {
        if (!actor1Id || !actor2Id) return [];
        const result = await fetchWithContext<Production[]>(
          endpoints.productionsShared(actor1Id, actor2Id),
          {},
          3
        );

        // Update rate limit status
        if (result.rateLimitInfo.limit > 0) {
          setRateLimitStatus(formatRateLimitStatus(result.rateLimitInfo));
        }

        if (result.error) throw result.error;
        return result.data || [];
      },
      enabled: !!actor1Id && !!actor2Id,
      staleTime: 5 * 60 * 1000,
    }),
    rateLimitStatus,
  };
}

// 3. Shared Actors (For Compare Page)
// "Find all actors shared between Movie A and Movie B"
export function useSharedActorsFromMovies(movie1Id: string | undefined, movie2Id: string | undefined) {
  const [rateLimitStatus, setRateLimitStatus] = useState<RateLimitStatus | null>(null);

  return {
    ...useQuery<SharedActor[]>({
      queryKey: ["sharedActorsMovies", movie1Id, movie2Id],
      queryFn: async () => {
        if (!movie1Id || !movie2Id) return [];
        const result = await fetchWithContext<SharedActor[]>(
          endpoints.sharedActors(movie1Id, movie2Id),
          {},
          3
        );

        // Update rate limit status
        if (result.rateLimitInfo.limit > 0) {
          setRateLimitStatus(formatRateLimitStatus(result.rateLimitInfo));
        }

        if (result.error) throw result.error;
        return result.data || [];
      },
      enabled: !!movie1Id && !!movie2Id,
      staleTime: 5 * 60 * 1000,
    }),
    rateLimitStatus,
  };
}

export function useProductionDetails(id: string) {
  return useQuery({
    queryKey: ["productionDetails", id],
    queryFn: async () => {
      const res = await fetch(endpoints.productionDetails(id));
      if (!res.ok) throw new Error("Failed to fetch details");
      return res.json();
    },
    enabled: !!id,
  });
}

