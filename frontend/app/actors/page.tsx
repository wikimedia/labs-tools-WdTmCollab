"use client";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import Header from "@/client/components/layout/header";
import ActorCard from "@/client/components/actors/actor-card";
import SearchComponent from "@/client/components/searchComponent";
import { log } from "console";

<<<<<<< HEAD
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/client/components/layout/header";
import ActorCard from "@/client/components/actors/actor-card";

interface Actor {
  id: string;
  label: string;
  description?: string;
  url: string;
  imageUrl?: string;
}

export default function ActorsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useQuery<Actor[]>({
    queryKey: ["actorSearch", searchTerm],
    queryFn: async () => {
      const url = `http://localhost:3001/actors/search?name=${encodeURIComponent(searchTerm)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json() as Promise<Actor[]>;
    },
    enabled: searchTerm.trim().length > 0,
  });

  const actors = data || [];
=======
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
>>>>>>> f2b788a7620658ed94d8f400b1e8e4c5b523a589

  return (
    <main>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Actors</h1>
        <div className="mb-8">
          <div className="relative max-w-md">
<<<<<<< HEAD
            <input
              type="text"
              placeholder="Search actors..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        {isLoading ? (
          <p>Loading actors...</p>
        ) : error ? (
          <p>Error loading actors.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {actors.map((actor) => (
              <ActorCard
                key={actor.id}
                id={actor.id}
                name={actor.label}
                collaborationCount={0}
              />
            ))}
          </div>
        )}
=======
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
>>>>>>> f2b788a7620658ed94d8f400b1e8e4c5b523a589
      </div>
    </main>
  );
}
