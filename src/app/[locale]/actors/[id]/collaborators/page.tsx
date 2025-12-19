"use client";

import { useParams } from "next/navigation";
import { Link } from "@/src/i18n/routing";
import { useState, useEffect, useRef } from "react";
import { useCoActors } from "@/src/hooks/api/useActors";
import { ChevronLeft, Users, AlertTriangle } from "lucide-react";
import { ProductionProfileSkeleton } from "@/src/components/ui/skeleton-loader";
import { Card, CardContent } from "@/src/components/ui/card";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useGridColumns } from "@/src/hooks/api/use-grid-columns";
import { useTranslations } from "next-intl";

export default function ActorCollaboratorsPage() {
  const params = useParams();
  const actorId = params.id as string;
  const listRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("actorCollaborators");

  const { columns, isClient } = useGridColumns();

  const [page, setPage] = useState(1);
  const [allActors, setAllActors] = useState<any[]>([]);
  const ITEMS_PER_PAGE = 20;

  const {
    data: newCoActors = [],
    isLoading,
    isError,
    isPlaceholderData
  } = useCoActors(actorId, page, ITEMS_PER_PAGE);

  useEffect(() => {
    if (newCoActors.length > 0) {
      setAllActors((prev) => {
        const newIds = new Set(newCoActors.map((a: any) => a.actorId));
        const filteredPrev = prev.filter((p) => !newIds.has(p.actorId));
        return [...filteredPrev, ...newCoActors];
      });
    }
  }, [newCoActors]);

  const rowCount = Math.ceil(allActors.length / columns);

  const virtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => 320,
    overscan: 5,
    scrollMargin: listRef.current?.offsetTop ?? 0,
    enabled: isClient,
  });

  useEffect(() => {
    const [lastItem] = [...virtualizer.getVirtualItems()].reverse();

    if (!lastItem) return;

    if (
      lastItem.index >= rowCount - 1 &&
      !isLoading &&
      !isPlaceholderData &&
      newCoActors.length === ITEMS_PER_PAGE
    ) {
      setPage((prev) => prev + 1);
    }
  }, [
    virtualizer.getVirtualItems(),
    rowCount,
    isLoading,
    isPlaceholderData,
    newCoActors.length
  ]);


  if (!isClient) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t("pageTitle")}</h1>
        </div>
        <ProductionProfileSkeleton />
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href={`/actors/${actorId}`}
          className="text-muted-foreground hover:text-primary flex items-center mb-4 transition-colors w-fit"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {t("backToProfile")}
        </Link>
        <h1 className="text-3xl font-bold text-foreground">{t("pageTitle")}</h1>
        <p className="text-muted-foreground mt-2">
          {t("pageDescription")}
        </p>
      </div>

      {isError && allActors.length === 0 ? (
        <div className="p-8 text-center bg-destructive/10 border border-destructive/20 rounded-xl text-destructive flex flex-col items-center gap-2">
          <AlertTriangle className="h-6 w-6" />
          <span>{t("errorLoading")}</span>
        </div>
      ) : (
        <div ref={listRef}>
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const rowStart = virtualRow.index * columns;
              const rowActors = allActors.slice(rowStart, rowStart + columns);

              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 absolute top-0 left-0 w-full"
                  style={{
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {rowActors.map((actor: any) => (
                    <Link
                      key={actor.actorId}
                      href={`/actors/${encodeURIComponent(actor.actorId)}`}
                      className="block group h-full"
                    >
                      <Card className="h-full overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                        <div className="aspect-square w-full bg-muted relative overflow-hidden">
                          {actor.image ? (
                            <img
                              src={actor.image}
                              alt={actor.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground/30">
                              <Users className="h-20 w-20" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {actor.name}
                          </h3>
                          <div className="mt-3 flex items-center text-sm">
                            <span className="inline-flex items-center bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium text-xs">
                              <Users className="w-3 h-3 mr-1.5" />
                              {actor.sharedWorks} {t("collaborations")}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>

          {isLoading && (
            <div className="mt-6">
              <ProductionProfileSkeleton />
            </div>
          )}

          {!isLoading && allActors.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              {t("noHistoryFound")}
            </div>
          )}
        </div>
      )}
    </main>
  );
}