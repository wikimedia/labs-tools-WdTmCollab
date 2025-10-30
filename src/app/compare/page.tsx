"use client";

import { useState } from "react";
import { endpoints } from "@/utils/endpoints";
import SearchComponent from "@/src/components/compare/searchComponent";

interface Movie {
  id: string;
  label: string;
  description?: string;
  type: string;
  url: string;
  imageUrl?: string;
  year?: Date | null;
  imageType: string;
}

interface Actor {
  id: string;
  name: string;
  description?: string;
  image?: string;
  sharedWorks?: string;
  awardCount?: string;
}


export default function SharedActorsFromMovies() {
  // Use movie names as state, with defaults matching the mapping keys.
  const [movie1, setMovie1Name] = useState<Movie | null>(null);
  const [movie2, setMovie2Name] = useState<Movie | null>(null);

  const [sharedActors, setSharedActors] = useState<Actor[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSharedActors = async () => {
    if (!movie1 || !movie2) {
      alert("Please select both movies.");
      return;
    }
    console.log(movie1, movie2);

    if (!movie1.id || !movie2.id) {
      alert("One or both movie names are not recognized.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const url = endpoints.sharedActors(movie1.id, movie2.id);
      const response = await fetch(url);
      console.log(movie1.id, movie2.id, response);

      if (!response.ok) {
        throw new Error("Failed to fetch shared actors.");
      }

      const data: Actor[] = await response.json();
      setSharedActors(data);
    } catch (err) {
      console.error(err);
      setError("Error fetching shared actors.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Shared Actors from Movies</h1>
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
           <SearchComponent  placeholder="Search First Movie" onSelect={(movie: Movie) => setMovie1Name(movie)} />
            <SearchComponent placeholder="Search First Movie" onSelect={(movie: Movie) => setMovie2Name(movie)} />
          </div>

          <button
            onClick={fetchSharedActors}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Fetching..." : "Fetch Shared Actors"}
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
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
          {sharedActors.length === 0 &&
            !loading &&
            movie1 &&
            movie2 && (
              <p className="mt-4 text-gray-600">No shared actors found.</p>
            )}
        </div>
      </main>
  );
}
