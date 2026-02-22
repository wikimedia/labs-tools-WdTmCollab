"use client";

import { useTranslations } from "next-intl";
import { useCollaborationStats } from "@/src/hooks/api/useCollaboration";

export default function CollaborationStatsCard({ actorId }: { actorId: string }) {
  const { data: stats, isLoading, isError } = useCollaborationStats(actorId);
  const t = useTranslations("common");

  if (isLoading) return <div className="h-24 bg-card animate-pulse rounded-lg" />;
  if (isError || !stats) return null;

  return (
    <div className="bg-card p-6 rounded-xl shadow-md border border-border">
      <h3 className="text-lg font-bold text-foreground mb-4">{t("careerStats")}</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-primary/50 rounded-lg">
          <div className="text-2xl font-bold bg-primary">{stats.totalWorks}</div>
          <div className="text-xs bg-primary uppercase tracking-wide">{t("totalWorks")}</div>
        </div>

        <div className="p-3 bg-secondary rounded-lg border border-border">
          <div className="text-2xl font-bold text-purple-600">{stats.totalCollaborators}</div>
          <div className="text-xs text-purple-800 uppercase tracking-wide">{t("collaborators")}</div>
        </div>

        <div className="p-3 bg-secondary rounded-lg col-span-2">
          <div className="text-sm text-green-800 mb-1">{t("mostFrequentCollaborator")}</div>
          {stats.mostFrequentCollaborator ? (
            <div className="flex justify-between items-end">
              <span className="font-bold text-lg text-green-700">
                {stats.mostFrequentCollaborator.name}
              </span>
              <span className="text-xs bg-secondary px-2 py-1 rounded border border-border">
                {stats.mostFrequentCollaborator.count} {t("projects")}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground italic">{t("noneFound")}</span>
          )}
        </div>
      </div>
    </div>
  );
}