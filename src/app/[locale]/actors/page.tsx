"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCoActors, Actor, useActorSearch } from "@/src/hooks/api/useActors";
import GenericSearch from "@/src/components/ui/generic-search";
import { Button } from "@/src/components/ui/button";
import { Skeleton, SkeletonCard, SkeletonCollaboratorCard, SkeletonRepeat } from "@/src/components/ui/skeleton-loader";
import { usePaginatedSearch } from "@/src/hooks/usePaginatedSearch";
import { endpoints } from "@/utils/endpoints";

export default function ActorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const actorId = searchParams.get("actorId") || "";
  const actorLabel = searchParams.get("label") || "";
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const ITEMS_PER_PAGE = 20;

  const {
    data,
    isLoading: loading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = usePaginatedSearch({
    query: actorId,
    endpoint: (id: string) => endpoints.co_ActorSearch(id),
    queryKey: ["coActors"],
    enabled: !!actorId,
    perPage: ITEMS_PER_PAGE,
    paramType: "offset",
  });

  const allCoActors = data?.pages.flatMap(page => page.results) || [];

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "200px" }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSelectActor = (actor: Actor | null) => {
    if (!actor) return;
    const params = new URLSearchParams();
    params.set("actorId", actor.id);
    params.set("label", actor.label);
    router.push(`?${params.toString()}`);
  };

  return (
    <main className='flex-grow'>
      <div className='min-h-screen bg-slate-50 flex flex-col items-center pt-16 px-4 pb-12'>
        <div className='w-full max-w-5xl p-8 space-y-6'>
          <h2>Find Actor Collaborations</h2>
          <p className='content-text'>
            Start by searching for an actor to see who they frequently work
            with.
          </p>

          <div className='relative z-50'>
            <GenericSearch<Actor>
              onSelect={handleSelectActor}
              useSearchHook={useActorSearch}
              initialValue={actorLabel}
              placeholder='Search for an actor...'
            />
          </div>
        </div>

        {loading && <SkeletonCollaboratorCard />}

        {allCoActors.length > 0 && (
          <div className="w-full max-w-5xl mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Collaborators of <span className="text-blue-600">{actorLabel}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allCoActors.map((coActor: any) => (
                <div key={coActor.actorId} className="flex flex-col items-center bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={
                      coActor.image ||
                      `https://ui-avatars.com/api/?name=${coActor.name}&background=random`
                    }
                    alt={coActor.name}
                    className='w-28 h-28 object-cover rounded-full border-4 border-white shadow-lg mb-4'
                  />
                  <h3 className='text-lg font-bold text-gray-900 text-center'>
                    {coActor.name}
                  </h3>
                  <span className='mt-4 inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full'>
                    {coActor.sharedWorks} Collaborations
                  </span>
                </div>
            ))}
            {/* Sentinel for infinite scroll */}
            {hasNextPage && (
              <div ref={sentinelRef} className="h-4 col-span-full"></div>
            )}
          </div>
        </div>
        )}
        {!loading && allCoActors.length === 0 && actorId && (
          <p className="mt-8 text-center text-gray-600">
            Loading collaborators...
          </p>
        )}
    
        {isError && (
          <div className="mt-8 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">We couldn't load collaborators</h3>
              <p className="text-gray-600 mb-4">Check your connection and try again.</p>
            </div>
          </div>
        )}

        {isError && <p className='mt-8 text-red-600'>Error fetching actors.</p>}
      </div>
    </main>
  );
}
