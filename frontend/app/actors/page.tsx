"use client";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import Header from "@/client/components/layout/header";
import ActorCard from "@/client/components/actors/actor-card";
import SearchComponent from "@/client/components/searchComponent";
import { log } from "console";

interface Actor {
  id: string;
  name: string;
  description?: string;
  url: string;
  image?: string;
  sharedWorks?: number;
}

export default function ActorsPage() {
  const [actor, setActor] = useState<Actor | null>(null);
  const [results, setResults] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoActors = async () => {
    console.log(actor);

    if (!actor) {
      alert("Please select an actor first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching actors for:", actor);
      console.log(actor.id);

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
  function extractWikidataId(url) {
    const match = url.match(/Q\d+/);
    return match ? match[0] : null;
  }
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
        <button
          onClick={fetchCoActors}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch Co-Actors"}
        </button>
        {/* Display co-actors list */}
        {results.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold">Co-Actors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {results.map((coActor) => (
                <ActorCard
                  key={`${Date.now()}-${uuidv4()}`}
                  id={coActor.id}
                  name={coActor.name} // Corrected from `label` to `name`
                  imageUrl={coActor.image}
                  collaborationCount={coActor.sharedWorks} // Optional field
                />
              ))}{" "}
            </div>
          </div>
        )}
        {/* No co-actors found */}
        {results.length === 0 && !loading && actor && (
          <p className="mt-4 text-gray-600">No co-actors found.</p>
        )}{" "}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </main>
  );
}
