"use client";

import { useState } from "react";
import SearchComponent from "@/src/components/searchComponent";
import { Actor } from "@/src/hooks/api/useActors";
import { useSharedProductions } from "@/src/hooks/api/useProductSearch";

export default function ProductionsPage() {
  const [actor1, setActor1] = useState<Actor | null>(null);
  const [actor2, setActor2] = useState<Actor | null>(null);
  const [isSearchActive, setIsSearchActive] = useState(false);


  const {
    data: sharedCastings = [],
    isLoading: loading,
    error,
  } = useSharedProductions(
    isSearchActive ? actor1?.id : undefined,
    isSearchActive ? actor2?.id : undefined
  );

  const handleFetchCastings = () => {
    if (!actor1 || !actor2) {
      alert("Please select both actors.");
      return;
    }
    setIsSearchActive(true);
  };

  const handleSelectActor1 = (actor: Actor | null) => {
    setActor1(actor);
    setIsSearchActive(false);
  };

  const handleSelectActor2 = (actor: Actor | null) => {
    setActor2(actor);
    setIsSearchActive(false);
  };

  return (
    <main className="flex-grow">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center w-full">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Shared Productions
          </h1>
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-2xl">
            <SearchComponent onSelect={handleSelectActor1} />
            <SearchComponent onSelect={handleSelectActor2} />
          </div>
          <button
            onClick={handleFetchCastings}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Fetching..." : "Fetch Shared Productions"}
          </button>
        </div>
      </div>

      {/* Render Logic */}
      {sharedCastings.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-center">Shared Productions</h2>
          <div className="flex items-center justify-center w-full mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Note: Logic simplified to standard map since hook returns array */}
              {sharedCastings.map((production, idx) => (
                <div
                  key={production.id || `${production.title}-${idx}`}
                  className="p-4 border rounded-lg shadow-md bg-white flex flex-col"
                >
                  <img
                    src={production.image || production.logo || ""}
                    alt={production.title}
                    className="w-full h-48 object-cover rounded"
                  />
                  <div className="flex flex-col flex-grow mt-2">
                    <h3 className="text-lg font-medium">{production.title}</h3>
                    <p className="text-sm text-gray-600 flex-grow">
                      {production.description}
                    </p>
                    {production.wikipedia && (
                      <a
                        href={production.wikipedia}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 mt-2 block"
                      >
                        Wikipedia
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {sharedCastings.length === 0 && !loading && isSearchActive && (
        <p className="mt-4 text-center text-gray-600">No shared productions found.</p>
      )}
      {error && <p className="text-red-500 mt-4 text-center">Error fetching shared castings.</p>}
    </main>
  );
}