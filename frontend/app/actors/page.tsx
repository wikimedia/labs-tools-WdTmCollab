"use client";

import { useState } from "react";
import Header from "@/client/components/layout/header";
import ActorCard from "@/client/components/actors/actor-card";
import SearchComponent from "@/client/components/searchComponent";

interface Actor {
  id: string;
  label: string;
  description?: string;
  url: string;
  imageUrl?: string;
}

export default function ActorsPage() {
  const [actor, setActor] = useState<Actor | null>(null);
  const [results, setResults] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActors = async () => {
    if (!actor) {
      setError("Please select an actor first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching actors for:", actor);

      const response = await fetch(
        `http://localhost:3000/actors/co-actors?actorId=${encodeURIComponent(actor.id)}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch actors.");
      }

      const data: Actor[] = await response.json();
      console.log(data);

      setResults(data);
    } catch (error) {
      setError("Error fetching actors.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Actors</h1>
        <div className="mb-8">
          <div className="relative max-w-md">
            <SearchComponent onSelect={(actor: Actor) => setActor(actor)} />
          </div>
        </div>

        {actor && (
          <div className="mt-6 p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-bold">Selected Actor</h2>
            <div className="flex items-center space-x-4 mt-2">
              {actor.imageUrl && (
                <img
                  src={actor.imageUrl}
                  alt={actor.label}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <h3 className="text-lg font-medium">{actor.label}</h3>
                <p className="text-sm text-gray-600">ID: {actor.id}</p>
              </div>
            </div>
            <button
              onClick={fetchActors}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Fetching..." : "Fetch Actors"}
            </button>
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {results.map((actor) => (
            <ActorCard
              key={actor.id}
              id={actor.id}
              name={actor.label}
              collaborationCount={0}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
