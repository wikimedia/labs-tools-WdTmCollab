"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useCoActors } from "@/src/hooks/api/useActors";
import { ChevronLeft, Loader2, Users, AlertTriangle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { SkeletonCard, SkeletonRepeat } from "@/src/components/ui/skeleton-loader";
import { Card, CardContent } from "@/src/components/ui/card";

export default function ActorCollaboratorsPage() {
  const params = useParams();
  const actorId = params.id as string;
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const {
    data: coActors = [],
    isLoading,
    isError,
    isPlaceholderData
  } = useCoActors(actorId, page, ITEMS_PER_PAGE);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href={`/actors/${actorId}`}
          className="text-muted-foreground hover:text-primary flex items-center mb-4 transition-colors w-fit"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Profile
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Full Collaboration History</h1>
        <p className="text-muted-foreground mt-2">
          All actors who have worked with this person.
        </p>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <SkeletonRepeat
          count={8}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        >
          <SkeletonCard />
        </SkeletonRepeat>
      ) : isError ? (
        <div className="p-8 text-center bg-destructive/10 border border-destructive/20 rounded-xl text-destructive flex flex-col items-center gap-2">
          <AlertTriangle className="h-6 w-6" />
          <span>Failed to load collaborators. Please try again later.</span>
        </div>
      ) : (
        <>
          {/* Grid of Actors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {coActors.map((actor: any) => (
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
                        {actor.sharedWorks} collaborations
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {coActors.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No collaboration history found.
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-center items-center space-x-4 mt-12 py-8 border-t border-border/40">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <span className="text-sm font-medium text-muted-foreground min-w-[3rem] text-center">
              Page {page}
            </span>

            <Button
              variant="default"
              onClick={() => setPage((p) => p + 1)}
              disabled={coActors.length < ITEMS_PER_PAGE || isPlaceholderData || isLoading}
            >
              Next
              {isLoading && isPlaceholderData ? (
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              ) : (
                <ChevronLeft className="w-4 h-4 ml-2 rotate-180" />
              )}
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
