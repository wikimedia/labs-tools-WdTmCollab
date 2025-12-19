"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Movie, useSharedActorsFromMovies } from "@/src/hooks/api/useProductSearch";
import { Clapperboard } from "lucide-react";
import { SkeletonCard, SkeletonRepeat } from "@/src/components/ui/skeleton-loader";
import GenericSearch from "@/src/components/ui/generic-search";
import { Card } from "@/src/components/ui/card";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { endpoints } from "@/utils/endpoints";
import { useTranslations } from "next-intl";

export default function SharedActorsFromMovies() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("compare");

  const movie1Id = searchParams.get("movie1") || undefined;
  const movie2Id = searchParams.get("movie2") || undefined;
  const movie1Label = searchParams.get("label1") || "";
  const movie2Label = searchParams.get("label2") || "";

  const {
    data: sharedActors = [],
    isLoading: loading,
    error
  } = useSharedActorsFromMovies(movie1Id, movie2Id);

  const updateUrl = (key: "movie1" | "movie2", movie: Movie | null) => {
    const params = new URLSearchParams(searchParams.toString());
    const idKey = key;
    const labelKey = key === "movie1" ? "label1" : "label2";

    if (movie) {
      params.set(idKey, movie.id);
      params.set(labelKey, movie.label);
    } else {
      params.delete(idKey);
      params.delete(labelKey);
    }
    router.push(`?${params.toString()}`);
  };

  const renderMovieItem = (movie: Movie) => (
    <Button
      className='w-full flex items-center px-5 py-3 hover:bg-gray-50 transition-colors text-left group'
      onClick={() => {
        /* Handled by GenericSearch parent */
      }}
    >
      <div className='h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden flex-shrink-0 border border-blue-100 text-blue-500'>
        {movie.imageUrl ? (
          <img
            src={movie.imageUrl}
            alt=''
            className='h-full w-full object-cover'
          />
        ) : (
          <Clapperboard className='w-5 h-5' />
        )}
      </div>
      <div className='ml-4 flex-grow min-w-0'>
        <p className='font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate'>
          {movie.label}
        </p>
        <p className='text-sm text-gray-500 truncate'>
          {movie.year ? `(${movie.year})` : ""} {movie.description}
        </p>
      </div>
    </Button>
  );

  return (
    <main className='flex-grow'>
      <div className='container mx-auto px-4 py-8'>
        <h2>{t("pageTitle")}</h2>
        <div className='mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto relative z-50'>
          <GenericSearch<Movie>
            placeholder={t("searchFirstMovie")}
            onSelect={(m) => updateUrl("movie1", m)}
            initialValue={movie1Label}
            renderItem={renderMovieItem}
            enablePagination={true}
            endpoint={endpoints.movieSearch}
            queryKey={["movieSearch"]}
          />
          <GenericSearch<Movie>
            placeholder={t("searchSecondMovie")}
            onSelect={(m) => updateUrl("movie2", m)}
            initialValue={movie2Label}
            renderItem={renderMovieItem}
            enablePagination={true}
            endpoint={endpoints.movieSearch}
            queryKey={["movieSearch"]}
          />
        </div>

        {/* Results */}
        {loading && (
          <SkeletonRepeat
            count={8}
            className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'
          >
            <SkeletonCard />
          </SkeletonRepeat>
        )}

        {sharedActors.length > 0 && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {sharedActors.map((actor) => (
              <Card
                key={actor.id}
                className='p-4 flex items-center gap-4 hover:shadow-md transition-shadow'
              >
                <div className='h-16 w-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0'>
                  <img
                    src={actor.image || ""}
                    alt={actor.name}
                    className='w-full h-full object-cover'
                  />
                </div>
                <div>
                  <h3 className='font-bold text-gray-900'>{actor.name}</h3>
                  <span className='text-blue-600 text-sm font-medium'>
                    {actor.sharedWorks} {t("sharedWorks")}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {sharedActors.length === 0 && !loading && movie1Id && movie2Id && (
          <p className='mt-4 text-gray-600'>{t("noSharedActors")}</p>
        )}
      </div>
    </main>
  );
}
