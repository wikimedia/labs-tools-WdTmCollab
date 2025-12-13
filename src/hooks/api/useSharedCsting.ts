import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/utils/endpoints";

export interface SharedProduction {
  title: string;
  description: string;
  image?: string | null;
  logo?: string | null;
  wikipedia?: string;
  publicationDate?: string;
}

export function useSharedCastings(actor1Id: string | undefined, actor2Id: string | undefined) {
  return useQuery<SharedProduction[]>({
    queryKey: ["sharedCastings", actor1Id, actor2Id],
    queryFn: async () => {
      if (!actor1Id || !actor2Id) return [];
      const res = await fetch(endpoints.productionsShared(actor1Id, actor2Id));
      if (!res.ok) throw new Error("Failed to fetch shared castings");
      return res.json();
    },
    enabled: !!actor1Id && !!actor2Id,
    staleTime: 5 * 60 * 1000,
  });
}