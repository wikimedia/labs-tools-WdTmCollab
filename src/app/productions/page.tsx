"use client";

import { useRouter, useSearchParams } from "next/navigation";
import SearchComponent from "@/src/components/searchComponent";
import { Actor } from "@/src/hooks/api/useActors";
import { useSharedProductions } from "@/src/hooks/api/useProductSearch";

export default function ProductionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const actor1Id = searchParams.get("actor1") || undefined;
  const actor2Id = searchParams.get("actor2") || undefined;
  const actor1Label = searchParams.get("label1") || "";
  const actor2Label = searchParams.get("label2") || "";

  const {
    data: sharedCastings = [],
    isLoading: loading,
    error,
  } = useSharedProductions(actor1Id, actor2Id);

  const updateUrl = (key: "actor1" | "actor2", actor: Actor | null) => {
    const params = new URLSearchParams(searchParams.toString());
    const idKey = key;
    const labelKey = key === "actor1" ? "label1" : "label2";

    if (actor) {
      params.set(idKey, actor.id);
      params.set(labelKey, actor.label);
    } else {
      params.delete(idKey);
      params.delete(labelKey);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <main className="flex-grow">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center w-full">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Shared Productions
          </h1>
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-2xl">
            <SearchComponent
              placeholder="Select First Actor"
              onSelect={(a) => updateUrl("actor1", a)}
              initialValue={actor1Label}
            />
            <SearchComponent
              placeholder="Select Second Actor"
              onSelect={(a) => updateUrl("actor2", a)}
              initialValue={actor2Label}
            />
          </div>
        </div>
      </div>

      {/* Render Logic */}
      {sharedCastings.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-center">Shared Productions</h2>
          <div className="flex items-center justify-center w-full mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
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

      {loading && (
        <div className="flex justify-center mt-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {sharedCastings.length === 0 && !loading && actor1Id && actor2Id && (
        <p className="mt-4 text-center text-gray-600">No shared productions found between these actors.</p>
      )}

      {error && <p className="text-red-500 mt-4 text-center">Error fetching shared castings.</p>}
    </main>
  );
}