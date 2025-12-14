import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/utils/endpoints";

export interface Actor {
  id: string;
  label: string;
  description?: string;
  url: string;
  imageUrl?: string;
}

export function useActorSearch(query: string) {
  return useQuery<Actor[]>({
    queryKey: ["actorSearch", query],
    queryFn: async () => {
      const res = await fetch(endpoints.actorSearch(query));
      if (!res.ok) throw new Error("Failed to search actors");
      return res.json();
    },
    enabled: query.length > 1,
    staleTime: 5 * 60 * 1000,
  });
}