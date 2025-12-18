import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { endpoints } from "@/utils/endpoints";
import { fetchWithContext, RateLimitInfo, formatRateLimitStatus, RateLimitStatus } from "@/utils/rateLimit";

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

export function useActorSearch(query: string) {
  const [rateLimitStatus, setRateLimitStatus] = useState<RateLimitStatus | null>(null);

  return {
    ...useQuery<Actor[]>({
      queryKey: ["actorSearch", query],
      queryFn: async () => {
        const result = await fetchWithContext<Actor[]>(
          endpoints.actorSearch(query),
          {},
          3
        );

        // Update rate limit status
        if (result.rateLimitInfo.limit > 0) {
          setRateLimitStatus(formatRateLimitStatus(result.rateLimitInfo));
        }

        // Log deprecation warnings
        if (result.deprecationWarning) {
          console.warn("Deprecation Notice:", result.deprecationWarning);
        }

        if (result.error) throw result.error;
        return result.data || [];
      },
      enabled: query.length > 2,
      staleTime: 5 * 60 * 1000,
    }),
    rateLimitStatus,
  };
}

//  Get Actor Details
export function useActorDetails(actorId: string) {
  const [rateLimitStatus, setRateLimitStatus] = useState<RateLimitStatus | null>(null);

  return {
    ...useQuery<ActorDetail>({
      queryKey: ["actorDetails", actorId],
      queryFn: async () => {
        const result = await fetchWithContext<any>(
          endpoints.actorDetails(actorId),
          {},
          3
        );

        // Update rate limit status
        if (result.rateLimitInfo.limit > 0) {
          setRateLimitStatus(formatRateLimitStatus(result.rateLimitInfo));
        }

        if (result.error) throw result.error;

        const raw = result.data;
        // Normalize single object vs array response
        return Array.isArray(raw) ? raw[0] : raw;
      },
      enabled: !!actorId,
    }),
    rateLimitStatus,
  };
}

export function useCoActors(actorId: string, page: number, limit: number) {
  const offset = (page - 1) * limit;
  const [rateLimitStatus, setRateLimitStatus] = useState<RateLimitStatus | null>(null);

  return {
    ...useQuery({
      queryKey: ["coActors", actorId, page, limit],
      queryFn: async () => {
        const url = `${endpoints.co_ActorSearch(actorId)}&limit=${limit}&offset=${offset}`;
        const result = await fetchWithContext(url, {}, 3);

        // Update rate limit status
        if (result.rateLimitInfo.limit > 0) {
          setRateLimitStatus(formatRateLimitStatus(result.rateLimitInfo));
        }

        if (result.error) throw result.error;
        return result.data || [];
      },
      enabled: !!actorId,
      placeholderData: keepPreviousData,
      staleTime: 5 * 60 * 1000,
    }),
    rateLimitStatus,
  };
}
//  Get Popular Actors
export function usePopularActors() {
  const [rateLimitStatus, setRateLimitStatus] = useState<RateLimitStatus | null>(null);

  return {
    ...useQuery({
      queryKey: ["popularActors"],
      queryFn: async () => {
        const result = await fetchWithContext(
          endpoints.actorPopular(),
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
      staleTime: 10 * 60 * 1000, // Cache popular actors longer
    }),
    rateLimitStatus,
  };
}