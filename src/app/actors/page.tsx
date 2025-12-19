"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCoActors, Actor, useActorSearch } from "@/src/hooks/api/useActors";
import GenericSearch from "@/src/components/ui/generic-search";
import { Button } from "@/src/components/ui/button";
import { SkeletonCard, SkeletonRepeat } from "@/src/components/ui/skeleton-loader";

export default function ActorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const actorId = searchParams.get("actorId") || "";
  const actorLabel = searchParams.get("label") || "";
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const ITEMS_PER_PAGE = 20;

  const {
    data: results = [],
    isLoading: loading,
    isError,
    isPlaceholderData,
    refetch,
  } = useCoActors(actorId, currentPage, ITEMS_PER_PAGE);

  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleSelectActor = (selectedActor: Actor | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedActor) {
      params.set("actorId", selectedActor.id);
      params.set("label", selectedActor.label);
      params.set("page", "1");
    } else {
      params.delete("actorId");
      params.delete("label");
      params.delete("page");
    }
    router.push(`?${params.toString()}`);
  };

  // Reset visible count when actor changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [actorId]);

  return (
    <main className="flex-grow">
      <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-16 px-4 pb-12">
        <div className="w-full max-w-5xl p-8 space-y-6">
          <h1 className="text-4xl font-bold text-center text-gray-800">
            Find Actor Collaborations
          </h1>
          <p className="text-center text-gray-600 text-lg">
            Start by searching for an actor to see who they frequently work with.
          </p>

          <div className="relative z-50">
            <GenericSearch<Actor>
              onSelect={handleSelectActor}
              useSearchHook={useActorSearch}
              initialValue={actorLabel}
              placeholder="Search for an actor..."
            />
          </div>
        </div>

        {loading && <SkeletonRepeat
          count={8}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        >
          <SkeletonCard />
        </SkeletonRepeat>}

        {displayResults.length > 0 && (
          <div className="w-full max-w-5xl mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Collaborators of <span className="text-blue-600">{actorLabel}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayResults.map((coActor: any) => (
                <div key={coActor.actorId} className="flex flex-col items-center bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={coActor.image || `https://ui-avatars.com/api/?name=${coActor.name}&background=random`}
                    alt={coActor.name}
                    className="w-28 h-28 object-cover rounded-full border-4 border-white shadow-lg mb-4"
                  />
                  <h3 className="text-lg font-bold text-gray-900 text-center">{coActor.name}</h3>
                  <span className="mt-4 inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {coActor.sharedWorks} Collaborations
                  </span>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-6 mt-8">
              <Button onClick={() => updatePage(Math.max(currentPage - 1, 1))} disabled={currentPage === 1 || loading} className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50">Previous</Button>
              <span className="text-gray-700">Page {currentPage}</span>
              <Button onClick={() => updatePage(currentPage + 1)} disabled={results.length < ITEMS_PER_PAGE || loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">Next</Button>
            </div>
          </div>
        )}

        {isError && <p className="mt-8 text-red-600">Error fetching actors.</p>}
      </div>
    </main >
  );
}