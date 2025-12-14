"use client";

import { useRouter, useSearchParams } from "next/navigation";
import SearchComponent from "@/src/components/compare/searchComponent";
import { Movie, useSharedActorsFromMovies } from "@/src/hooks/api/useProductSearch";

export default function SharedActorsFromMovies() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const movie1Id = searchParams.get("movie1") || undefined;
  const movie2Id = searchParams.get("movie2") || undefined;

  const movie1Label = searchParams.get("label1") || "";
  const movie2Label = searchParams.get("label2") || "";

  const {
    data: sharedActors = [],
    isLoading: loading,
    error
  } = useSharedActorsFromMovies(movie1Id, movie2Id);

  const updateUrl = (key: "movie1" | "movie2", movie: Movie | null) => {
    const params = new URLSearchParams(searchParams.toString());
    const idKey = key;
    const labelKey = key === "movie1" ? "label1" : "label2";

    if (movie) {
      params.set(idKey, movie.id);
      params.set(labelKey, movie.label);
    } else {
      params.delete(idKey);
      params.delete(labelKey);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <main className="flex-grow">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shared Actors from Movies</h1>
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <SearchComponent
            placeholder="Search First Movie"
            onSelect={(m) => updateUrl("movie1", m)}
            initialValue={movie1Label}
          />
          <SearchComponent
            placeholder="Search Second Movie"
            onSelect={(m) => updateUrl("movie2", m)}
            initialValue={movie2Label}
          />
        </div>

        {loading && (
          <div className="flex justify-center mt-8">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error && <p className="text-red-500 mt-4">Error fetching shared actors.</p>}

        {sharedActors.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold">Shared Actors</h2>
            <div className="flex w-full mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sharedActors.map((actor) => (
                  <div
                    key={actor.id}
                    className="p-4 border rounded-lg shadow-md bg-white"
                  >
                    {actor.image && (
                      <img
                        src={actor.image}
                        alt={actor.name}
                        className="w-full h-75 object-cover rounded"
                      />
                    )}
                    <h3 className="text-lg font-medium mt-2">{actor.name}</h3>
                    {actor.description && (
                      <p className="text-sm text-gray-600">
                        {actor.description}
                      </p>
                    )}
                    <div className="flex justify-between mt-2">
                      <span className="text-blue-600 font-medium">
                        {actor.sharedWorks} shared works
                      </span>
                      <span className="text-amber-600 font-medium">
                        {actor.awardCount} awards
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {sharedActors.length === 0 && !loading && movie1Id && movie2Id && (
          <p className="mt-4 text-gray-600">No shared actors found.</p>
        )}
      </div>
    </main>
  );
}