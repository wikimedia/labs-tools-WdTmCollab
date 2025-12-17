"use client";

import { useParams } from "next/navigation";
import { useCoActors } from "@/src/hooks/api/useActors"; // Using the paginated hook!
import Link from "next/link";
import { useState } from "react";

export default function ActorCollaboratorsPage() {
  const params = useParams();
  const actorId = params.id as string;
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20; // Show more on a dedicated page

  // Use the existing paginated hook
  const {
    data: coActors = [],
    isLoading,
    isError,
    isPlaceholderData
  } = useCoActors(actorId, page, ITEMS_PER_PAGE);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href={`/actors/${actorId}`}
          className="text-blue-600 hover:underline flex items-center mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Profile
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Full Collaboration History</h1>
        <p className="text-gray-600 mt-2">
          All actors who have worked with this person.
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {isError && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          Failed to load collaborators.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {coActors.map((actor: any) => (
              <Link
                key={actor.actorId}
                href={`/actors/${encodeURIComponent(actor.actorId)}`}
                className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="aspect-square w-full bg-gray-100 relative overflow-hidden">
                  {actor.image ? (
                    <img
                      src={actor.image}
                      alt={actor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-4xl">
                      {actor.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {actor.name}
                  </h3>
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium">
                      {actor.sharedWorks} collaborations
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center space-x-4 mt-12">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-600">Page {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={coActors.length < ITEMS_PER_PAGE || isPlaceholderData}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}