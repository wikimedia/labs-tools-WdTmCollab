import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/utils/endpoints";

// --- Types ---
export interface Movie {
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
  return useQuery<Movie[]>({
    queryKey: ["movieSearch", query],
    queryFn: async () => {
      const res = await fetch(endpoints.movieSearch(query));
      if (!res.ok) throw new Error("Failed to search movies");
      return res.json();
    },
    enabled: query.length > 2,
    staleTime: 5 * 60 * 1000,
  });
}

// 2. Shared Productions (For Productions Page)
// "Find all movies shared between Actor A and Actor B"
export function useSharedProductions(actor1Id: string | undefined, actor2Id: string | undefined) {
  return useQuery<Production[]>({
    queryKey: ["sharedProductions", actor1Id, actor2Id],
    queryFn: async () => {
      if (!actor1Id || !actor2Id) return [];
      const res = await fetch(endpoints.productionsShared(actor1Id, actor2Id));
      if (!res.ok) throw new Error("Failed to fetch shared productions");
      return res.json();
    },
    enabled: !!actor1Id && !!actor2Id, // Auto-fetch when both IDs exist
    staleTime: 5 * 60 * 1000,
  });
}

// 3. Shared Actors (For Compare Page)
// "Find all actors shared between Movie A and Movie B"
export function useSharedActorsFromMovies(movie1Id: string | undefined, movie2Id: string | undefined) {
  return useQuery<SharedActor[]>({
    queryKey: ["sharedActorsMovies", movie1Id, movie2Id],
    queryFn: async () => {
      if (!movie1Id || !movie2Id) return [];
      const res = await fetch(endpoints.sharedActors(movie1Id, movie2Id));
      if (!res.ok) throw new Error("Failed to fetch shared actors");
      return res.json();
    },
    enabled: !!movie1Id && !!movie2Id, // Auto-fetch when both IDs exist
    staleTime: 5 * 60 * 1000,
  });
}