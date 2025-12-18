"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchComponent from "@/src/components/searchComponent";
import { usePopularActors, Actor } from "@/src/hooks/api/useActors";
import { Clapperboard, GitMerge, Network, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { SkeletonCard, SkeletonRepeat } from "@/src/components/ui/skeleton-loader";


const features = [
  {
    title: "Frequent Collaborators",
    description: "Discover which actors work together most often",
    icon: <Users className="w-6 h-6" />,
    link: "/actors",
  },
  {
    title: "Shared Productions",
    description: "Find all movies and TV shows shared between actors",
    icon: <Clapperboard className="w-6 h-6" />,
    link: "/compare",
  },
  {
    title: "Cross-Project Actors",
    description: "Identify actors who appeared in multiple productions",
    icon: <GitMerge className="w-6 h-6" />,
    link: "/productions",
  },
  {
    title: "Collaboration Clusters",
    description: "Visualize groups of actors who frequently work together",
    icon: <Network className="w-6 h-6" />,
    link: "/clusters",
  },
];

export default function Home() {
  const router = useRouter();
  const { data: popularActors = [], isLoading, error } = usePopularActors();

  const handleActorSelect = (actor: Actor | null) => {
    if (actor) {
      router.push(`/actors/${actor.id}`);
    }
  };

  return (
    <div className="w-full">
      <section className="relative bg-gradient-to-b from-blue-50/50 to-white pt-20 pb-32 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
            v1.0 Public Beta
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
            Wikidata <span className="text-primary">TransMedia</span> Collaboration
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            Explore the interconnected world of cinema. Discover frequent
            collaborators, visualize actor networks, and uncover the hidden
            communities of the entertainment industry.
          </p>

          {/* FIX: Changed z-10 to z-30 so it sits ABOVE the cards below */}
          <div className="max-w-2xl mx-auto relative z-30 shadow-xl rounded-2xl bg-white">
            <SearchComponent
              onSelect={handleActorSelect}
              placeholder="Search for an actor (e.g., Tom Hanks)..."
            />
          </div>
        </div>
      </section>

      {/* Features Grid - This has z-20, so search bar (z-30) will now cover it */}
      <div className="container mx-auto px-4 -mt-16 relative z-20 pb-16">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.link}
              className="block group outline-none h-full"
            >
              <Card className="h-full bg-white/80 backdrop-blur border-white/20 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <CardHeader>
                  <div className="text-primary mb-4 bg-primary/10 w-12 h-12 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>

        {/* Popular Actors Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Popular Actors</h2>
            <Link href="/actors" className="text-primary hover:underline font-medium">
              View all
            </Link>
          </div>

          {isLoading ? (
            <SkeletonRepeat
              count={8}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
            >
              <SkeletonCard />
            </SkeletonRepeat>
          ) : error ? (
            <div className="p-8 text-center bg-destructive/10 rounded-xl text-destructive">
              Unable to load popular actors at this time.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {popularActors.map((actor: any, idx: number) => (
                <Link
                  key={actor.id ? actor.id : `actor-${idx}`}
                  href={`/actors/${actor.id}`}
                  className="flex items-center p-3 bg-white border rounded-xl hover:shadow-md hover:border-primary/50 transition-all gap-4 group"
                >
                  <div className="w-14 h-14 rounded-full bg-muted flex-shrink-0 overflow-hidden border-2 border-transparent group-hover:border-primary transition-colors">
                    {actor.imageUrl ? (
                      <img
                        src={actor.imageUrl}
                        alt={actor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground font-bold text-xl">
                        {actor.name?.charAt(0) || "?"}
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {actor.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate font-medium">
                      {actor.awardCount !== undefined
                        ? `${actor.awardCount} awards`
                        : "View details"}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}