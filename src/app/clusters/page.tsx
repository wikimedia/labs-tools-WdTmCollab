"use client";

import { useState } from "react";
import Link from "next/link";
import { useProductionClusters } from "@/src/hooks/api/useCollaboration";
import SearchComponent from "@/src/components/searchComponent"; // Use your consolidated search
import { Actor } from "@/src/hooks/api/useActors";

export default function ClustersPage() {
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);

  // Only fetch if an actor is selected
  const { data: clusters = [], isLoading } = useProductionClusters(selectedActor?.id || "");

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Collaboration Clusters</h1>
        <p className="text-gray-600 mb-8">
          Find which productions served as "hubs" for an actor's network.
        </p>

        {/* 1. Search Selection */}
        <div className="max-w-xl mx-auto">
          <SearchComponent
            placeholder="Search for an actor first..."
            onSelect={(actor) => setSelectedActor(actor)}
          />
        </div>
      </div>

      {/* 2. Loading State */}
      {isLoading && selectedActor && (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Finding ensembles for {selectedActor.label}...</p>
        </div>
      )}

      {/* 3. Empty State (Selected but no data) */}
      {!isLoading && selectedActor && clusters.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p>No significant ensembles found for this actor.</p>
        </div>
      )}

      {/* 4. Real Data Grid */}
      {selectedActor && clusters.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-6">
            Top Ensembles for <span className="text-blue-600">{selectedActor.label}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clusters.map((cluster) => (
              <Link
                key={cluster.id}
                href={`/productions/${cluster.id}`}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{cluster.label}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                    {cluster.size} Actors
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {selectedActor.label} worked with {cluster.size} other tracked actors in this production.
                </p>
                <div className="mt-4 text-blue-600 text-sm font-medium hover:underline">
                  View Full Cast
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}