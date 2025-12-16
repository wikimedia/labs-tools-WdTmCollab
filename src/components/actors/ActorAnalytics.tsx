"use client";

import CollaborationStatsCard from "@/src/components/visualizations/CollaborationStatsCard";
import CollaborationNetwork from "../visualizations/collaboration-network";
import { useCollaborationNetwork, useProductionClusters } from "@/src/hooks/api/useCollaboration";

export default function ActorAnalytics({ actorId }: { actorId: string }) {
  const { data: networkData, isLoading: isNetworkLoading } = useCollaborationNetwork(actorId);
  const { data: clusters } = useProductionClusters(actorId);

  return (
    // FIX: Using grid with 'auto-rows' or explicit heights to manage layout
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mt-8">

      {/* Left Column: Stats & Clusters (Takes 1 column) */}
      <div className="space-y-6 w-full">
        <CollaborationStatsCard actorId={actorId} />

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Top Ensembles</h3>
          {clusters?.length ? (
            <ul className="space-y-3">
              {clusters.map((cluster) => (
                <li key={cluster.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded transition-colors">
                  <span className="font-medium text-gray-700 truncate max-w-[180px]" title={cluster.label}>
                    {cluster.label}
                  </span>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full whitespace-nowrap">
                    Cast: {cluster.size}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No major ensembles found.</p>
          )}
        </div>
      </div>

      {/* Right Column: Visualization (Takes 2 columns) */}
      {/* FIX: Set a specific height for Desktop so Graph can expand */}
      <div className="lg:col-span-2 w-full min-w-0">
        <div className="bg-white p-1 rounded-xl shadow-md border border-gray-100 h-[500px] lg:h-[600px] flex flex-col relative z-0">
          <div className="p-4 border-b border-gray-100 flex-shrink-0">
            <h3 className="text-lg font-bold text-gray-800">Collaboration Network</h3>
          </div>

          <div className="flex-grow relative overflow-hidden w-full">
            {isNetworkLoading ? (
              <div className="absolute inset-0 bg-gray-50 animate-pulse flex items-center justify-center text-gray-400">
                Building Network Graph...
              </div>
            ) : networkData && networkData.nodes.length > 0 ? (
              // Passing no height prop allows it to fill the flex container
              <CollaborationNetwork data={networkData} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-50">
                Not enough data to generate network.
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}