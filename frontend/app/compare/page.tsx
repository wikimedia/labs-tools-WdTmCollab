'use client';

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/client/components/layout/header";
import Image from "next/image";

interface Actor {
  id: string;
  name: string;
}

interface Production {
  title: string;
  description?: string;
  image?: string | null;
  logo?: string | null;
  wikipedia?: string;
  publicationDate?: string;
}

const BaseUrl = "http://localhost:3001";

export default function ComparePage() {
  // Local state for selected actor IDs
  const [actor1, setActor1] = useState<string>("");
  const [actor2, setActor2] = useState<string>("");

  const {
    data: actorsData,
    isLoading: actorsLoading,
    error: actorsError,
  } = useQuery<Actor[]>({
    queryKey: ["actorsList"],
    queryFn: async (): Promise<Actor[]> => {
      const res = await fetch(`${BaseUrl}/actors`);
      if (!res.ok) {
        throw new Error("Error fetching actors");
      }
      return res.json();
    },
  });

  function extractQId(fullUrl: string): string {
    const parts = fullUrl.split("/");
    return parts[parts.length - 1];
  }  

  const {
    data: sharedProductions,
    refetch,
    isLoading: compareLoading,
    error: compareError,
  } = useQuery<Production[]>({
    queryKey: ["compareActors", actor1, actor2],
    queryFn: async (): Promise<Production[]> => {
      const id1 = extractQId(actor1);
      const id2 = extractQId(actor2);
      const url = `${BaseUrl}/productions/shared?actor1Id=${id1}&actor2Id=${id2}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Error fetching shared productions");
      }
      return res.json();
    },
    enabled: false,
  });  

  const handleCompare = () => {
    if (actor1 && actor2) {
      refetch();
    }
  };

  return (
    <main>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Compare Actors</h1>

        {/* Actor selection section */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Actors to Compare</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Actor
              </label>
              {actorsLoading ? (
                <p>Loading actors...</p>
              ) : actorsError ? (
                <p>Error loading actors.</p>
              ) : (
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={actor1}
                  onChange={(e) => setActor1(e.target.value)}
                >
                  <option value="">Select an actor</option>
                  {actorsData?.map((actor) => (  // Fetch the actors list from the backend

                    <option key={actor.id} value={actor.id}>
                      {actor.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Second Actor
              </label>
              {actorsLoading ? (
                <p>Loading actors...</p>
              ) : actorsError ? (
                <p>Error loading actors.</p>
              ) : (
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={actor2}
                  onChange={(e) => setActor2(e.target.value)}
                >
                  <option value="">Select an actor</option>
                  {actorsData?.map((actor) => (
                    <option key={actor.id} value={actor.id}>
                      {actor.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="mt-6">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={handleCompare}
              disabled={!actor1 || !actor2 || compareLoading}
            >
              {compareLoading ? "Comparing..." : "Compare"}
            </button>
          </div>

          {compareError && (
            <p className="text-red-500 mt-4">
              Error: {compareError instanceof Error ? compareError.message : "Unknown error"}
            </p>
          )}
        </div>

        {/* Shared productions display section */}
        {sharedProductions && (
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-xl font-semibold mb-4">Shared Productions</h2>
            {sharedProductions.length > 0 ? (
              <div className="space-y-4">
                {sharedProductions.map((production, index) => (
                  <div key={index} className="border rounded-lg p-4 flex items-center gap-4">
                    {production.image && (
                      <Image
                        src={production.image}
                        alt={production.title}
                        width={64}
                        height={64}
                        className="object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-medium text-lg">{production.title}</h3>
                      {production.description && (
                        <p className="text-sm text-gray-600">{production.description}</p>
                      )}
                      {production.publicationDate && (
                        <p className="text-sm text-gray-500">
                          Publication Date: {production.publicationDate}
                        </p>
                      )}
                      {production.wikipedia && (
                        <a
                          href={production.wikipedia}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-sm"
                        >
                          Wikipedia
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No shared productions found.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
