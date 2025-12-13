import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { endpoints } from "@/utils/endpoints";

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
  return useQuery<Actor[]>({
    queryKey: ["actorSearch", query],
    queryFn: async () => {
      const res = await fetch(endpoints.actorSearch(query));
      if (!res.ok) throw new Error("Failed to search actors");
      return res.json();
    },
    enabled: query.length > 2, // Only fetch if query has 3+ chars
  });
}

//  Get Actor Details
export function useActorDetails(actorId: string) {
  return useQuery<ActorDetail>({
    queryKey: ["actorDetails", actorId],
    queryFn: async () => {
      const res = await fetch(endpoints.actorDetails(actorId));
      if (!res.ok) throw new Error("Failed to fetch actor details");

      const raw: any = await res.json();
      // Normalize single object vs array response
      return Array.isArray(raw) ? raw[0] : raw;
    },
    enabled: !!actorId,
  });
}

export function useCoActors(actorId: string, page: number, limit: number) {
  const offset = (page - 1) * limit;

  return useQuery({
    queryKey: ["coActors", actorId, page, limit],
    queryFn: async () => {
      // It passes 'limit=8' to the API because you passed 8 from the page component
      const url = `${endpoints.co_ActorSearch(actorId)}&limit=${limit}&offset=${offset}`;
      const res = await fetch(url);

      if (!res.ok) throw new Error("Failed to fetch co-actors");
      return res.json();
    },
    enabled: !!actorId,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
}
//  Get Popular Actors
export function usePopularActors() {
  return useQuery({
    queryKey: ["popularActors"],
    queryFn: async () => {
      const res = await fetch(endpoints.actorPopular());
      if (!res.ok) throw new Error("Failed to fetch popular actors");
      return res.json();
    },
  });
}