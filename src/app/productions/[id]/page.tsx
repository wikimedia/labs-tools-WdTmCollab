"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/src/components/layout/header";
import ActorCard from "@/src/components/actors/actor-card";

export default function ProductionDetailPage() {
  const params = useParams();
  const productionId = params.id as string;

  // In a real app, you would fetch this data from the API
  const production = mockProductions.find((p) => p.id === productionId) || {
    id: productionId,
    title: "Unknown Production",
    year: "Unknown",
    type: "Unknown",
    description: "No description available",
    actors: [],
  };

  return (
    <main>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/productions"
            className="text-blue-600 hover:underline flex items-center focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded p-1"          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Productions
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="w-full md:w-1/3 lg:w-1/4 aspect-[2/3] bg-gray-200 rounded-lg flex items-center justify-center text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                  />
                </svg>
              </div>
              <div className="w-full md:w-2/3 lg:w-3/4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold">{production.title}</h1>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {production.type}
                  </span>
                </div>

                <div className="text-gray-600 mb-4">
                  <span className="font-medium">Year:</span> {production.year}
                </div>

                <p className="text-gray-600 mb-6">{production.description}</p>

                <div className="flex space-x-4">
                  <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    Add to Compare
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t">
            <div className="p-8">
              <h2 className="text-xl font-semibold mb-4">Cast</h2>

              {production.actors && production.actors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {production.actors.map((actor) => (
                    <ActorCard key={actor.id} id={actor.id} name={actor.name} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No cast information available.</p>
              )}
            </div>
          </div>

          <div className="border-t">
            <div className="p-8">
              <h2 className="text-xl font-semibold mb-4">
                Find Actors in Common
              </h2>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-4">
                  Select another production to find actors who appeared in both:
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <label htmlFor="production-compare" className="sr-only">Select a production to compare</label>
                  <select
                    id="production-compare"
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    aria-label="Select a production to find common actors"
                  >
                    <option value="">Select a production</option>
                    {mockProductions
                      .filter((p) => p.id !== productionId)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.year})
                        </option>
                      ))}
                  </select>

                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Find Common Actors
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Mock data
const mockProductions = [
  {
    id: "134773",
    title: "Forrest Gump",
    year: 1994,
    type: "Movie",
    description:
      "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate, and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.",
    actors: [
      { id: "38111", name: "Tom Hanks", role: "Forrest Gump" },
      { id: "28782", name: "Robin Wright", role: "Jenny Curran" },
      { id: "51329", name: "Gary Sinise", role: "Lieutenant Dan Taylor" },
    ],
  },
  {
    id: "123456",
    title: "The Post",
    year: 2017,
    type: "Movie",
    description:
      "A cover-up spanning four U.S. Presidents pushes the country's first female newspaper publisher and her editor to join an unprecedented battle between press and government.",
    actors: [
      { id: "38111", name: "Tom Hanks", role: "Ben Bradlee" },
      { id: "17492", name: "Meryl Streep", role: "Kay Graham" },
      { id: "39187", name: "Sarah Paulson", role: "Tony Bradlee" },
    ],
  },
  {
    id: "104257",
    title: "Saving Private Ryan",
    year: 1998,
    type: "Movie",
    description:
      "Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed in action.",
    actors: [
      { id: "38111", name: "Tom Hanks", role: "Captain Miller" },
      { id: "42215", name: "Matt Damon", role: "Private Ryan" },
      { id: "28782", name: "Tom Sizemore", role: "Sergeant Horvath" },
    ],
  },
];
