import { endpoints } from "@/utils/endpoints";
import { useQuery } from "@tanstack/react-query";

// --- Types Matching Backend ---

export interface CollaborationNode {
  id: string;
  name: string;
  image?: string | null;
  imageUrl?: string | null;
  type: "actor" | "production";
  weight?: number; // Used for node size (collaboration count)
  sharedWorks?: number;
  count?: number;
  group?: number; // Used for color coding clusters
}

export interface CollaborationLink {
  source: string;
  target: string;
  value?: number;
  weight?: number;
  count?: number;
}

export interface NetworkData {
  nodes: CollaborationNode[];
  links: CollaborationLink[];
}

function asNumber(value: unknown, fallback = 1) {
  const numberValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function normalizeNetworkData(data: NetworkData): NetworkData {
  return {
    nodes: data.nodes.map((node) => ({
      ...node,
      image: node.image ?? node.imageUrl ?? null,
      weight: asNumber(node.weight ?? node.sharedWorks ?? node.count, 1),
    })),
    links: data.links.map((link) => ({
      ...link,
      value: asNumber(link.value ?? link.weight ?? link.count, 1),
    })),
  };
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
      return normalizeNetworkData(await res.json());
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
