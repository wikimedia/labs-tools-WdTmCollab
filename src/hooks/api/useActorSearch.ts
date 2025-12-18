import { useQuery } from "@tanstack/react-query";
import React, { useState, useCallback } from "react";
import { endpoints } from "@/utils/endpoints";
import { fetchWithContext, formatRateLimitStatus, RateLimitStatus } from "@/utils/rateLimit";
import { useDebounce } from "@/utils/debounce";

export interface Actor {
  id: string;
  label: string;
  description?: string;
  url: string;
  imageUrl?: string;
}

export function useActorSearch(query: string) {
  const [rateLimitStatus, setRateLimitStatus] = useState<RateLimitStatus | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [debouncedCallback] = useDebounce(
    useCallback((q: string) => {
      setDebouncedQuery(q);
    }, []),
    300 // 300ms debounce delay
  );

  // Update debounced query when input changes
  React.useEffect(() => {
    debouncedCallback(query);
  }, [query, debouncedCallback]);

  return {
    ...useQuery<Actor[]>({
      queryKey: ["actorSearch", debouncedQuery],
      queryFn: async () => {
        const result = await fetchWithContext<Actor[]>(
          endpoints.actorSearch(debouncedQuery),
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
      enabled: debouncedQuery.length > 1,
      staleTime: 5 * 60 * 1000,
    }),
    rateLimitStatus,
  };
}