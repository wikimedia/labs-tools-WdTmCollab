"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useActorSearch, Actor } from "@/src/hooks/api/useActors";
import { useSharedProductions } from "@/src/hooks/api/useProductSearch";
import GenericSearch from "@/src/components/ui/generic-search";

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
    error
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
    <main className='flex-grow'>
      <div className='container mx-auto px-4 py-8'>
        <div className='flex flex-col items-center justify-center w-full'>
          <h2>Shared Productions</h2>
          <div className='mb-8 grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-2xl relative z-50'>
            <GenericSearch<Actor>
              placeholder='Select First Actor'
              useSearchHook={useActorSearch}
              onSelect={(a) => updateUrl("actor1", a)}
              initialValue={actor1Label}
            />
            <GenericSearch<Actor>
              placeholder='Select Second Actor'
              useSearchHook={useActorSearch}
              onSelect={(a) => updateUrl("actor2", a)}
              initialValue={actor2Label}
            />
          </div>
        </div>
      </div>

      {/* Results Rendering */}
      {sharedCastings.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 container mx-auto'>
          {sharedCastings.map((production, idx) => (
            <div
              key={production.id || idx}
              className='p-4 border rounded-lg shadow-md bg-white flex flex-col'
            >
              <img
                src={production.image || production.logo || ""}
                alt={production.title}
                className='w-full h-48 object-cover rounded'
              />
              <div className='mt-2'>
                <h3 className='text-lg font-medium'>{production.title}</h3>
                <p className='text-sm text-gray-600 line-clamp-3'>
                  {production.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className='text-center mt-8'>Loading shared productions...</div>
      )}
      {error && (
        <p className='text-center text-red-500 mt-4'>
          Error fetching shared productions.
        </p>
      )}
    </main>
  );
}
