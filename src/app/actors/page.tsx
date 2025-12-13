"use client";

import { useRouter, useSearchParams } from "next/navigation";
import SearchComponent from "@/src/components/searchComponent";
import { useCoActors, Actor } from "@/src/hooks/api/useActors";
import SkeletonLoader from "@/src/components/ui/skeleton-loader";

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
  } = useCoActors(actorId, currentPage, ITEMS_PER_PAGE);

  const displayResults = results.slice(0, ITEMS_PER_PAGE);

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

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handleNextPage = () => {
    if (!isPlaceholderData && results.length === ITEMS_PER_PAGE) {
      updatePage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    updatePage(Math.max(currentPage - 1, 1));
  };

  return (
    <main className="flex-grow">
      <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-16 px-4 pb-12">
        <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl p-8 space-y-6">
          <h1 className="text-4xl font-bold text-center text-gray-800">
            Find Actor Collaborations
          </h1>
          <p className="text-center text-gray-500 text-lg">
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
          <div className="mt-8 text-center">
            <p className="text-gray-600">Loading collaborations...</p>
          </div>
        )}

        {/* Show results if we have them */}
        {displayResults.length > 0 && (
          <div className="w-full max-w-5xl mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Collaborators of{" "}
              <span className="text-blue-600">
                {actorLabel || "Selected Actor"}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayResults.map((coActor: any) => (
                <div
                  key={coActor.actorId}
                  className="flex flex-col items-center bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={
                      coActor.image ||
                      `https://ui-avatars.com/api/?name=${coActor.name.replace(
                        /\s/g,
                        "+"
                      )}&background=random`
                    }
                    alt={coActor.name}
                    className="w-28 h-28 object-cover rounded-full border-4 border-white shadow-lg mb-4"
                  />
                  <h3 className="text-lg font-bold text-gray-900 text-center">
                    {coActor.name}
                  </h3>
                  {coActor.description && (
                    <p className="text-sm text-gray-500 text-center mt-1">
                      {coActor.description}
                    </p>
                  )}
                  {coActor.sharedWorks !== undefined && (
                    <span className="mt-4 inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {coActor.sharedWorks} Collaborations
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center space-x-6 mt-8">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1 || loading}
                className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="text-gray-700 font-medium">
                Page {currentPage}
              </span>

              <button
                onClick={handleNextPage}
                disabled={results.length < ITEMS_PER_PAGE || loading}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {!loading && displayResults.length === 0 && actorId && (
          <p className="mt-8 text-center text-gray-600">
            No co-actors found on this page.
          </p>
        )}

        {isError && (
          <p className="mt-8 text-center text-red-600 bg-red-100 p-4 rounded-lg">
            Error fetching actors.
          </p>
        )}
      </div>
    </main>
  );
}
