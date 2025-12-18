"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchComponent from "@/src/components/searchComponent";
import { useCoActors, Actor } from "@/src/hooks/api/useActors";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton-loader";

export default function ActorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const actorId = searchParams.get("actorId") || "";
  const actorLabel = searchParams.get("label") || "";
  const pageParam = searchParams.get("page");

  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const ITEMS_PER_PAGE = 9;

  const {
    data: results = [],
    isLoading: loading,
    isError,
    isPlaceholderData,
    refetch,
  } = useCoActors(actorId, currentPage, ITEMS_PER_PAGE);

  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_PAGE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const resultsArray = Array.isArray(results) ? results : [];
  const uniqueResults = Array.from(
    new Map(
      resultsArray.map((prod: any) => [
        prod?.id ??
          prod?.actorId ??
          prod?.label ??
          prod?.name ??
          JSON.stringify(prod),
        prod,
      ])
    ).values()
  );

  const displayedResults = uniqueResults.slice(0, visibleCount);
  const hasMoreLocal = visibleCount < uniqueResults.length;

  const handleLoadMore = () => {
    setVisibleCount((v) => Math.min(v + ITEMS_PER_PAGE, uniqueResults.length));
  };

  const handleSelectActor = (actor: Actor | null) => {
    if (!actor) return;
    const params = new URLSearchParams();
    params.set("actorId", actor.id);
    params.set("label", actor.label);
    router.push(`?${params.toString()}`);
  };

  // Reset visible count when actor changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [actorId]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const el = loadMoreRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting && hasMoreLocal) {
          setVisibleCount((v) =>
            Math.min(v + ITEMS_PER_PAGE, uniqueResults.length)
          );
        }
      },
      { root: null, rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMoreLocal, uniqueResults.length]);

  return (
    <main className="flex-grow">
      <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-16 px-4 pb-12">
        <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl p-8 space-y-6">
          <h1 className="text-4xl font-bold text-center text-gray-800">
            Find Actor Collaborations
          </h1>
          <p className="text-center text-gray-600 text-lg">
            Start by searching for an actor to see who they frequently work
            with.
          </p>

          <div className="space-y-4">
            {/* Pass initialValue from URL to hydrate the input */}
            <SearchComponent
              onSelect={handleSelectActor}
              initialValue={actorLabel}
            />
          </div>
        </div>

        {loading && (
          <div className="w-full max-w-5xl mt-12">
            <Skeleton />
          </div>
        )}

        {displayedResults.length > 0 && (
          <div className="w-full max-w-5xl mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Collaborators of{" "}
              <span className="text-blue-600">
                {actorLabel || "Selected Actor"}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedResults.map((coActor: any) => {
                const safeId = coActor?.id ?? coActor?.actorId ?? null;
                const safeName = coActor?.name ?? coActor?.label ?? "Unknown";
                const img = coActor?.image ?? coActor?.imageUrl ?? null;
                const description =
                  coActor?.description ?? coActor?.label ?? "";
                const sharedWorks =
                  coActor?.sharedWorks ?? coActor?.collaborations ?? null;
                return (
                  <div
                    key={safeId ?? safeName}
                    className="flex flex-col items-center bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300"
                  >
                    <img
                      src={
                        img ||
                        `https://ui-avatars.com/api/?name=${String(
                          safeName
                        ).replace(/\s/g, "+")}&background=random`
                      }
                      alt={safeName}
                      className="w-28 h-28 object-cover rounded-full border-4 border-white shadow-lg mb-4"
                    />
                    <h3 className="text-lg font-bold text-gray-900 text-center">
                      {safeName}
                    </h3>
                    {description && (
                      <p className="text-sm text-gray-500 text-center mt-1">
                        {description}
                      </p>
                    )}
                    {sharedWorks !== null && (
                      <span className="mt-4 inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {sharedWorks} Collaborations
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            {/* infinite scroll sentinel / load-more fallback */}
            <div className="flex justify-center items-center mt-8">
              {hasMoreLocal ? (
                <div className="space-y-2">
                  <div ref={loadMoreRef} className="h-2 w-full" />
                  <div className="text-center">
                    <button
                      onClick={handleLoadMore}
                      className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                      disabled={!hasMoreLocal}
                    >
                      Load more
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {!loading && displayedResults.length === 0 && actorId && (
          <p className="mt-8 text-center text-gray-600">
            No co-actors found on this page.
          </p>
        )}

        {isError && (
          <div className="mt-8 flex justify-center">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">We couldn’t load collaborators</h3>
              <p className="text-gray-600 mb-4">Check your connection and try again.</p>
              <Button onClick={() => refetch()} className="bg-blue-600 hover:bg-blue-700 text-white">Retry</Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
