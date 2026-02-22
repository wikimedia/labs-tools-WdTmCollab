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
    <main className="container mx-auto px-4 py-8 bg-background min-h-screen">
      <div className="bg-card rounded-xl shadow-sm border border-border p-8 mb-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="aspect-[2/3] bg-muted rounded-lg overflow-hidden shadow-md">
            {production.imageUrl ? (
              <img src={production.imageUrl} alt={production.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground/30">
                {production.title.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">{production.title}</h1>
          <div className="text-lg text-muted-foreground mb-6">
            {production.year} • {production.type === "movie" ? t("movie") : t("tvShow")}
          </div>
          <p className="text-foreground/90 leading-relaxed text-lg max-w-2xl mb-6">
            {production.description}
          </p>

          <div className="text-sm text-muted-foreground">
            {t("source")} <Link href={`https://www.wikidata.org/wiki/${production.id}`} target="_blank" className="text-primary hover:underline font-medium">{t("wikidata")}</Link>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-6 border-b border-border pb-2 text-foreground">{t("castTitle")}</h2>

        {production.cast && production.cast.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {production.cast.map((actor: any) => (
              <Link
                key={actor.id}
                href={`/actors/${actor.id}`}
                className="group block bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-muted overflow-hidden">
                  {actor.imageUrl ? (
                    <img
                      src={actor.imageUrl}
                      alt={actor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {actor.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground italic">{t("noCast")}</p>)}
      </section>
    </main>
  );
}