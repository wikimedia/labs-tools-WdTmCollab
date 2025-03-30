'use client';

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

  return (
    <main>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Actors</h1>
        <div className="mb-8">
          <div className="relative max-w-md">
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
      </div>
    </main>
  );
}
