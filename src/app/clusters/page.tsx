"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Clapperboard, Users } from "lucide-react";
import GenericSearch from "@/src/components/ui/generic-search";
import { useProductionClusters } from "@/src/hooks/api/useCollaboration";
import { Actor, useActorSearch } from "@/src/hooks/api/useActors";
import {
  SkeletonCard,
  SkeletonRepeat
} from "@/src/components/ui/skeleton-loader";
import { Card } from "@/src/components/ui/card";

export default function ClustersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const actorId = searchParams.get("actorId") || "";
  const actorLabel = searchParams.get("label") || "";

  const { data: clusters = [], isLoading } = useProductionClusters(actorId);

  const handleSelectActor = (actor: Actor | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (actor) {
      params.set("actorId", actor.id);
      params.set("label", actor.label);
    } else {
      params.delete("actorId");
      params.delete("label");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <main className='flex-grow container mx-auto px-4 py-8 min-h-screen'>
      <div className='max-w-4xl mx-auto mb-12 text-center'>
        <h2>Collaboration Clusters</h2>
        <p className='text-gray-600 mb-8'>
          Find which productions served as "hubs" for an actor's network.
        </p>

        <div className='max-w-xl mx-auto relative z-50'>
          <GenericSearch<Actor>
            placeholder='Search for an actor first...'
            useSearchHook={useActorSearch}
            onSelect={handleSelectActor}
            initialValue={actorLabel}
          />
        </div>
      </div>

      {isLoading && actorId && (
        <SkeletonRepeat
          count={8}
          className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'
        >
          <SkeletonCard />
        </SkeletonRepeat>
      )}

      {!isLoading && actorId && clusters.length === 0 && (
        <div className='text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200'>
          <p className='text-gray-500'>
            No significant ensembles found for this actor.
          </p>
        </div>
      )}

      {/* Real Data Grid */}
      {actorId && clusters.length > 0 && (
        <div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
          <h2 className='text-xl font-bold mb-6 flex items-center gap-2'>
            Top Ensembles for{" "}
            <span className='text-blue-600'>{actorLabel}</span>
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {clusters.map((cluster) => (
              <Link
                key={cluster.id}
                href={`/productions/${cluster.id}`}
                className='block group h-full'
              >
                <Card className='p-6 hover:shadow-lg transition-all hover:border-blue-200 h-full flex flex-col justify-between'>
                  <div>
                    <div className='flex justify-between items-start mb-3'>
                      <div className='p-2 bg-blue-50 text-blue-600 rounded-lg'>
                        <Clapperboard className='w-5 h-5' />
                      </div>
                      <span className='bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1'>
                        <Users className='w-3 h-3' />
                        {cluster.size}
                      </span>
                    </div>

                    <h3 className='text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-2'>
                      {cluster.label}
                    </h3>

                    <p className='text-sm text-gray-500 leading-relaxed'>
                      {actorLabel} worked with {cluster.size} tracked actors in
                      this production.
                    </p>
                  </div>

                  <div className='mt-4 pt-4 border-t border-gray-100 text-blue-600 text-sm font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform'>
                    View Full Cast &rarr;
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
