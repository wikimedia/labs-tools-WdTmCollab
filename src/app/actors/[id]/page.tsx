"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ActorDetailPage() {
  const params = useParams();
  const actorId = params.id as string;
  const [actor, setActor] = useState({
    id: actorId,
    name: "Loading...",
    bio: "Fetching data...",
    productions: [],
  });
  async function getWikidataInfoWithImage(
    qId: any,
    language: any = "en",
    imageWidth: any
  ) {
    const API_URL = "https://www.wikidata.org/w/api.php";

    const params = new URLSearchParams({
      action: "wbgetentities",
      ids: qId.startsWith("Q") ? qId : `Q${qId}`,
      props: "labels|descriptions|claims",
      languages: language,
      format: "json",
      origin: "*", // CORS header
    });

    try {
      const response = await fetch(`${API_URL}?${params}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const entity = data.entities[qId];

      // Extract image filename from P18 claim if available
      const imageFilename =
        entity?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
      const imageUrl = imageFilename
        ? getCommonsImageUrl(imageFilename, imageWidth)
        : null;

      console.log(imageUrl, data);

      return {
        id: qId,
        label: entity?.labels?.[language]?.value || "No label available",
        description:
          entity?.descriptions?.[language]?.value || "No description available",
        imageUrl,
      };
    } catch (error) {
      console.error(`Failed to fetch ${qId}:`, error);
      return {
        id: qId,
        label: "Failed to load",
        description: "Failed to load",
        imageUrl: null,
      };
    }
  }

  /**
   * Helper function to generate Commons image URL
   */
  function getCommonsImageUrl(filename: any, width: any) {
    if (!filename) return null;
    const encoded = encodeURIComponent(filename.replace(/ /g, "_"));
    return width
      ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encoded}?width=${width}`
      : `https://commons.wikimedia.org/wiki/Special:FilePath/${encoded}`;
  }

  useEffect(() => {
    async function fetchActorData() {
      const data = await getWikidataInfoWithImage(actorId, "en", 300);
      setActor({
        id: actorId,
        name: data.label,
        bio: data.description,
        productions: [], // This would be replaced with actual production data if available
      });
    }

    fetchActorData();
  }, [actorId]);

  return (
    <main>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/actors"
            className="text-blue-600 hover:underline flex items-center"
          >
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
            Back to Actors
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl">
                {actor.name}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{actor.name}</h1>
                <p className="text-gray-600 mb-4">{actor.bio}</p>
              </div>
            </div>
          </div>

          <div className="border-t">
            <div className="p-8">
              <h2 className="text-xl font-semibold mb-4">Productions</h2>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Mock data
const mockActors = [
  {
    id: "38111",
    name: "Tom Hanks",
    bio: "Thomas Jeffrey Hanks is an American actor and filmmaker. Known for both his comedic and dramatic roles, he is one of the most popular and recognizable film stars worldwide.",
    productions: [
      { id: "134773", title: "Forrest Gump", year: 1994 },
      { id: "104257", title: "Saving Private Ryan", year: 1998 },
      { id: "170222", title: "Cast Away", year: 2000 },
      { id: "36657", title: "The Green Mile", year: 1999 },
    ],
  },
  {
    id: "17492",
    name: "Meryl Streep",
    bio: "Mary Louise 'Meryl' Streep is an American actress. Often described as 'the best actress of her generation', Streep is particularly known for her versatility and accent adaptability.",
    productions: [
      { id: "223702", title: "The Devil Wears Prada", year: 2006 },
      { id: "28574", title: "Sophie's Choice", year: 1982 },
      { id: "399055", title: "The Iron Lady", year: 2011 },
    ],
  },
];
