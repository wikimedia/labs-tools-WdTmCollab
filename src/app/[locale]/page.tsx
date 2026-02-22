"use client";
import { Link } from "../../i18n/routing";
import { useRouter } from "next/navigation";
import {
  Clapperboard,
  GitMerge,
  Network,
  Users,
  AlertTriangle,
} from "lucide-react";
import { useTranslations } from "next-intl";

import GenericSearch from "@/src/components/ui/generic-search";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/src/components/ui/card";
import {
  SkeletonCard,
  SkeletonRepeat,
} from "@/src/components/ui/skeleton-loader";
import {
  usePopularActors,
  Actor,
  useActorSearch,
} from "@/src/hooks/api/useActors";

export default function Home() {
  const router = useRouter();
  const t = useTranslations("home");

  const features = [
    {
      title: t("features.frequentCollaborators.title"),
      description: t("features.frequentCollaborators.description"),
      icon: <Users className="w-6 h-6" />,
      link: "/actors",
    },
    {
      title: t("features.sharedProductions.title"),
      description: t("features.sharedProductions.description"),
      icon: <Clapperboard className="w-6 h-6" />,
      link: "/compare",
    },
    {
      title: t("features.crossProjectActors.title"),
      description: t("features.crossProjectActors.description"),
      icon: <GitMerge className="w-6 h-6" />,
      link: "/productions",
    },
    {
      title: t("features.collaborationClusters.title"),
      description: t("features.collaborationClusters.description"),
      icon: <Network className="w-6 h-6" />,
      link: "/clusters",
    },
  ];

  const { data: popularActors = [], isLoading, error } = usePopularActors();

  const handleActorSelect = (actor: Actor | null) => {
    if (actor) {
      router.push(`/actors/${actor.id}`);
    }
  };

  return (
    <div className="w-full bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background pt-20 pb-32 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-secondary px-3 py-1 text-sm font-medium text-primary mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            {t("versionBadge")}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            <span className="gradient-text">{t("heroTitle1")}</span>{" "}
            <span className="text-primary">{t("heroTitle2")}</span>{" "}
            <span className="gradient-text">{t("heroTitle3")}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            {t("heroDescription")}
          </p>

          <div className="max-w-2xl mx-auto relative z-50 shadow-2xl rounded-2xl bg-card border border-border">
            <GenericSearch<Actor>
              onSelect={handleActorSelect}
              useSearchHook={useActorSearch}
              placeholder={t("searchPlaceholder")}
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <div className="container mx-auto px-4 -mt-16 relative z-20 pb-16">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.link}
              className="block group outline-none h-full"
            >
              <Card className="h-full bg-card/80 backdrop-blur border-border shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <CardHeader>
                  <div className="text-primary mb-4 bg-primary/10 w-12 h-12 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-base leading-relaxed">
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
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {t("popularActors.title")}
            </h2>
            <Link
              href="/actors"
              className="text-primary hover:underline font-medium"
            >
              {t("popularActors.viewAll")}
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
            <div className="p-8 text-center bg-destructive/10 rounded-xl text-destructive flex flex-col items-center border border-destructive/20">
              <AlertTriangle className="h-6 w-6 mb-2" />
              {t("popularActors.errorMessage")}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {popularActors.map((actor: any, idx: number) => (
                <Link
                  key={actor.id ? actor.id : `actor-${idx}`}
                  href={`/actors/${actor.id}`}
                  className="flex items-center p-3 bg-card border border-border rounded-xl hover:shadow-md hover:border-primary/50 transition-all gap-4 group"
                >
                  <div className="w-14 h-14 rounded-full bg-muted flex-shrink-0 overflow-hidden border-2 border-border group-hover:border-primary transition-colors">
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
                        ? `${actor.awardCount} ${t("popularActors.awards")}`
                        : t("popularActors.viewDetails")}
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