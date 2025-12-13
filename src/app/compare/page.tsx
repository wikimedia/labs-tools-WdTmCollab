"use client";

import { useState } from "react";
import SearchComponent from "@/src/components/compare/searchComponent"; // Assuming this handles Movie searching
import { Movie, useSharedActorsFromMovies } from "@/src/hooks/api/useProductSearch";

export default function SharedActorsFromMovies() {
  const [movie1, setMovie1Name] = useState<Movie | null>(null);
  const [movie2, setMovie2Name] = useState<Movie | null>(null);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // 1. Use the Hook
  const {
    data: sharedActors = [],
    isLoading: loading,
    error
  } = useSharedActorsFromMovies(
    isSearchActive ? movie1?.id : undefined,
    isSearchActive ? movie2?.id : undefined
  );

  const handleFetch = () => {
    if (!movie1 || !movie2) {
      alert("Please select both movies.");
      return;
    }
    if (!movie1.id || !movie2.id) {
      alert("One or both movie names are not recognized.");
      return;
    }
    setIsSearchActive(true);
  };

  const handleSelectMovie1 = (m: Movie | null) => { setMovie1Name(m); setIsSearchActive(false); };
  const handleSelectMovie2 = (m: Movie | null) => { setMovie2Name(m); setIsSearchActive(false); };

  return (
    <main className="flex-grow">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shared Actors from Movies</h1>
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Ensure generic types match if SearchComponent is strictly typed */}
          <SearchComponent placeholder="Search First Movie" onSelect={handleSelectMovie1} />
          <SearchComponent placeholder="Search Second Movie" onSelect={handleSelectMovie2} />
        </div>

        <button
          onClick={handleFetch}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch Shared Actors"}
        </button>

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

        {sharedActors.length === 0 && !loading && isSearchActive && (
          <p className="mt-4 text-gray-600">No shared actors found.</p>
        )}
      </div>
    </main>
  );
}