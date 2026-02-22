"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useActorSearch, Actor } from "@/src/hooks/api/useActors";
import { useSharedProductions } from "@/src/hooks/api/useProductSearch";
import GenericSearch from "@/src/components/ui/generic-search";
import { useTranslations } from "next-intl";

export default function ProductionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("productions");

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
    <main className='flex-grow bg-background transition-colors h-screen duration-300'>
      <div className='container mx-auto px-4 py-8'>
        <div className='flex flex-col items-center justify-center w-full'>
          <h2 className="text-3xl font-bold mb-6 text-foreground">{t("pageTitle")}</h2>
          <div className='mb-8 grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-2xl relative z-50'>
            <GenericSearch<Actor>
              placeholder={t("selectFirstActor")}
              useSearchHook={useActorSearch}
              onSelect={(a) => updateUrl("actor1", a)}
              initialValue={actor1Label}
            />
            <GenericSearch<Actor>
              placeholder={t("selectSecondActor")}
              useSearchHook={useActorSearch}
              onSelect={(a) => updateUrl("actor2", a)}
              initialValue={actor2Label}
            />
          </div>
        </div>
      </div>

      {sharedCastings.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 container mx-auto'>
          {sharedCastings.map((production, idx) => (
            <div
              key={production.id || idx}
              className='p-4 border border-border rounded-lg shadow-md bg-card flex flex-col transition-colors duration-300 hover:shadow-lg'
            >
              <img
                src={production.image || production.logo || ""}
                alt={production.title}
                className='w-full h-48 object-cover rounded bg-muted'
              />
              <div className='mt-2'>
                <h3 className='text-lg font-medium text-foreground'>{production.title}</h3>
                <p className='text-sm text-muted-foreground line-clamp-3'>
                  {production.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className='text-center mt-8 text-muted-foreground'>{t("loadingProductions")}</div>
      )}
      {error && (
        <p className='text-center text-destructive mt-4 font-medium'>
          {t("errorFetchingProductions")}
        </p>
      )}
    </main>
  );
}
