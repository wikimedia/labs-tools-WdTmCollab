import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { endpoints } from "@/utils/endpoints";
import { fetchWithContext, formatRateLimitStatus, RateLimitStatus } from "@/utils/rateLimit";

export interface SharedProduction {
  title: string;
  description: string;
  image?: string | null;
  logo?: string | null;
  wikipedia?: string;
  publicationDate?: string;
}

export function useSharedCastings(actor1Id: string | undefined, actor2Id: string | undefined) {
  const [rateLimitStatus, setRateLimitStatus] = useState<RateLimitStatus | null>(null);

  return {
    ...useQuery<SharedProduction[]>({
      queryKey: ["sharedCastings", actor1Id, actor2Id],
      queryFn: async () => {
        if (!actor1Id || !actor2Id) return [];
        const result = await fetchWithContext<SharedProduction[]>(
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