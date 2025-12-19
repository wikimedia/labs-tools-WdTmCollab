"use client";

import { useParams } from "next/navigation";
import { Link } from "@/src/i18n/routing";
import { useProductionDetails } from "@/src/hooks/api/useProductSearch";
import { ProductionProfileSkeleton, SkeletonCard, SkeletonRepeat } from "@/src/components/ui/skeleton-loader";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function ProductionDetailPage() {
  const params = useParams();
  const productionId = params.id as string;
  const { data: production, isLoading, isError } = useProductionDetails(productionId);
  const t = useTranslations("productionDetail");

  if (isLoading) {
    return <ProductionProfileSkeleton />;
  }

  if (isError || !production) return <div className="text-center py-12">{t("notFound")}</div>;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden shadow-md">
            {production.imageUrl ? (
              <img src={production.imageUrl} alt={production.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                {production.title.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{production.title}</h1>
          <div className="text-lg text-gray-600 mb-6">
            {production.year} • {production.type === "movie" ? t("movie") : t("tvShow")}
          </div>
          <p className="text-gray-700 leading-relaxed text-lg max-w-2xl mb-6">
            {production.description}
          </p>

          <div className="text-sm text-gray-500">
            {t("source")} <Link href={`https://www.wikidata.org/wiki/${production.id}`} target="_blank" className="text-blue-600 hover:underline">{t("wikidata")}</Link>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">{t("castTitle")}</h2>

        {production.cast && production.cast.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {production.cast.map((actor: any) => (
              <Link
                key={actor.id}
                href={`/actors/${actor.id}`}
                className="group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  {actor.imageUrl ? (
                    <img
                      src={actor.imageUrl}
                      alt={actor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="font-medium text-gray-900 truncate group-hover:text-blue-600">
                    {actor.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">{t("noCast")}</p>
        )}
      </section>
    </main>
  );
}