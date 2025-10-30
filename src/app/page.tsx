"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { endpoints } from "@/utils/endpoints";

export default function Home() {
  interface PopularActor {
    id: string;
    name: string;
    awardCount: number;
    nominationCount: number;
    imageUrl: string | null;
  }

  const [popularActors, setPopularActors] = useState<PopularActor[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(false);

  useEffect(() => {
    async function fetchPopular() {
      setLoadingPopular(true);
      try {
        const res = await fetch(endpoints.actorPopular());
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: PopularActor[] = await res.json();
        setPopularActors(data);
      } catch (err) {
        console.error("Failed to load popular actors:", err);
      } finally {
        setLoadingPopular(false);
      }
    }

    fetchPopular();
  }, []);
  return (
    <main>
      <div className="container mx-auto px-4 py-12">
        <section className="mb-16 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Wikidata TransMedia Collaboration
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the interconnected world of actors, discover frequent
            collaborators, and visualize the networks of the entertainment
            industry.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <FeatureCard
            title="Frequent Collaborators"
            description="Discover which actors work together most often"
            icon={<CollaboratorsIcon />}
            link="/actors"
          />
          <FeatureCard
            title="Shared Productions"
            description="Find all movies and TV shows shared between actors"
            icon={<ProductionsIcon />}
            link="/compare"
          />
          <FeatureCard
            title="Cross-Project Actors"
            description="Identify actors who appeared in multiple productions"
            icon={<CrossProjectIcon />}
            link="/productions"
          />
          <FeatureCard
            title="Collaboration Clusters"
            description="Visualize groups of actors who frequently work together"
            icon={<ClusterIcon />}
            link="/shared-castings"
          />
        </section>

        <section className="bg-white rounded-xl shadow-md p-8 mb-16">
          <h2 className="text-2xl font-bold mb-4">Popular Actors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {loadingPopular ? (
              <div className="col-span-4 text-center text-gray-500">
                Loading popular actors...
              </div>
            ) : (
              Array.from(
                new Map(
                  popularActors.map((prod: any) => [prod.name, prod])
                ).values()
              ).map((actor: any, idx: number) => (
                <Link
                  key={actor.id ? actor.id : `${actor.name}-${idx}`}
                  href={`/actors/${actor.id}`}
                  className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                    {actor.imageUrl ? (
                      <img
                        src={actor.imageUrl}
                        alt={actor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg">
                        {actor.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium">{actor.name}</div>
                    <div className="text-sm text-gray-500">
                      {actor.nominationCount} Nominations • {actor.awardCount}{" "}
                      awards
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureCard({
  title,
  description,
  icon,
  link,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}) {
  return (
    <Link
      href={link}
      className="block bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
}

// Icons
function CollaboratorsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ProductionsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="m9 9 6 6" />
      <path d="m15 9-6 6" />
    </svg>
  );
}

function CrossProjectIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

function ClusterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  );
}

// Note: popular actors are loaded from backend /actors/popular
