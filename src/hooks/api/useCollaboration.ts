import { endpoints } from "@/utils/endpoints";
import { useQuery } from "@tanstack/react-query";

// --- Types Matching Backend ---

export interface CollaborationNode {
  id: string;
  name: string;
  image?: string;
  type: "actor" | "production";
  weight?: number; // Used for node size (collaboration count)
  group?: number; // Used for color coding clusters
}

export interface CollaborationLink {
  source: string;
  target: string;
  value: number;
}

export interface NetworkData {
  nodes: CollaborationNode[];
  links: CollaborationLink[];
}

export interface CollaborationStats {
  actorId: string;
  totalWorks: number;
  totalCollaborators: number;
  averageCollaboratorsPerWork: number;
  mostFrequentCollaborator: {
    id: string;
    name: string;
    count: number;
  } | null;
}

export interface YearTrend {
  year: number;
  count: number;
}

export interface ClusterGroup {
  id: string;
  label: string;
  size: number;
  // Using unknown[] instead of any[] if structure is unknown, 
  // or define a minimal Actor interface if known.
  actors: { id: string; name: string }[];
}

// --- Hooks ---

export function useCollaborationNetwork(actorId: string) {
  return useQuery<NetworkData>({
    queryKey: ["collabNetwork", actorId],
    queryFn: async () => {
      const res = await fetch(endpoints.collabNetwork(actorId));
      if (!res.ok) throw new Error("Failed to fetch network");
      return res.json();
    },
    enabled: !!actorId,
    staleTime: 10 * 60 * 1000, // 10 mins
  });
}

export function useCollaborationStats(actorId: string) {
  return useQuery<CollaborationStats>({
    queryKey: ["collabStats", actorId],
    queryFn: async () => {
      const res = await fetch(endpoints.collabStats(actorId));
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    enabled: !!actorId,
  });
}

export function useCollaborationTrends(actorId: string) {
  return useQuery<YearTrend[]>({
    queryKey: ["collabTrends", actorId],
    queryFn: async () => {
      const res = await fetch(endpoints.collabTrends(actorId));
      if (!res.ok) throw new Error("Failed to fetch trends");
      return res.json();
    },
    enabled: !!actorId,
  });
}

export function useProductionClusters(actorId: string) {
  return useQuery<ClusterGroup[]>({
    queryKey: ["collabClusters", actorId],
    queryFn: async () => {
      const res = await fetch(endpoints.collabClusters(actorId));
      if (!res.ok) throw new Error("Failed to fetch clusters");
      return res.json();
    },
    enabled: !!actorId,
  });
}