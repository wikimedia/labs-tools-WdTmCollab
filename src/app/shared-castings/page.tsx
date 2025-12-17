"use client";

import { useState } from "react";
import Link from "next/link";

export default function ClustersPage() {
  const [clusters, setClusters] = useState(mockClusters);

  return (
    <main className="flex-grow">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Collaboration Clusters</h1>

        <p className="text-gray-600 mb-8 max-w-3xl">
          Clusters represent groups of actors who frequently work together.
          These networks can reveal interesting patterns in casting and
          collaboration across the entertainment industry.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clusters.map((cluster) => (
            <div key={cluster.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-3">{cluster.name}</h2>
              <p className="text-gray-600 mb-4">{cluster.description}</p>

              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Top Actors:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cluster.topActors.map((actor) => (
                    <Link
                      key={actor.id}
                      href={`/actors/${actor.id}`}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors"
                    >
                      {actor.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Common Productions:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cluster.commonProductions.map((production) => (
                    <Link
                      key={production.id}
                      href={`/productions/${production.id}`}
                      className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {production.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

// Mock data
const mockClusters = [
  {
    id: "1",
    name: "Spielberg Regulars",
    description:
      "Actors who frequently appear in Steven Spielberg films, known for their dramatic performances and versatility.",
    topActors: [
      { id: "38111", name: "Tom Hanks" },
      { id: "42215", name: "Leonardo DiCaprio" },
      { id: "28782", name: "Mark Rylance" },
    ],
    commonProductions: [
      { id: "104257", title: "Saving Private Ryan" },
      { id: "456789", title: "Catch Me If You Can" },
      { id: "123456", title: "The Post" },
    ],
  },
  {
    id: "2",
    name: "Marvel Cinematic Universe",
    description:
      "The core group of actors who appear across multiple Marvel superhero films and form the backbone of the MCU.",
    topActors: [
      { id: "51329", name: "Samuel L. Jackson" },
      { id: "12345", name: "Robert Downey Jr." },
      { id: "23456", name: "Scarlett Johansson" },
    ],
    commonProductions: [
      { id: "345678", title: "The Avengers" },
      { id: "456789", title: "Iron Man" },
      { id: "567890", title: "Captain America" },
    ],
  },
  {
    id: "3",
    name: "Wes Anderson Ensemble",
    description:
      "The quirky and distinctive group of actors who regularly appear in Wes Anderson's stylized films.",
    topActors: [
      { id: "34567", name: "Bill Murray" },
      { id: "45678", name: "Owen Wilson" },
      { id: "56789", name: "Tilda Swinton" },
    ],
    commonProductions: [
      { id: "678901", title: "The Grand Budapest Hotel" },
      { id: "789012", title: "Moonrise Kingdom" },
      { id: "890123", title: "The Royal Tenenbaums" },
    ],
  },
  {
    id: "4",
    name: "HBO Drama Actors",
    description:
      "Actors who have appeared in multiple acclaimed HBO drama series, known for their complex character portrayals.",
    topActors: [
      { id: "67890", name: "Peter Dinklage" },
      { id: "78901", name: "Emilia Clarke" },
      { id: "89012", name: "Kit Harington" },
    ],
    commonProductions: [
      { id: "901234", title: "Game of Thrones" },
      { id: "012345", title: "Westworld" },
      { id: "123456", title: "True Detective" },
    ],
  },
  {
    id: "5",
    name: "Tarantino Collaborators",
    description:
      "The distinctive group of actors who frequently appear in Quentin Tarantino's stylized and dialogue-heavy films.",
    topActors: [
      { id: "51329", name: "Samuel L. Jackson" },
      { id: "90123", name: "Uma Thurman" },
      { id: "01234", name: "Tim Roth" },
    ],
    commonProductions: [
      { id: "234567", title: "Pulp Fiction" },
      { id: "345678", title: "Kill Bill" },
      { id: "456789", title: "The Hateful Eight" },
    ],
  },
  {
    id: "6",
    name: "Coen Brothers Regulars",
    description:
      "Actors who frequently collaborate with the Coen Brothers, known for their distinctive performances in quirky and often dark comedies.",
    topActors: [
      { id: "12345", name: "Frances McDormand" },
      { id: "23456", name: "John Goodman" },
      { id: "34567", name: "Steve Buscemi" },
    ],
    commonProductions: [
      { id: "567890", title: "Fargo" },
      { id: "678901", title: "The Big Lebowski" },
      { id: "789012", title: "No Country for Old Men" },
    ],
  },
];
