"use client";

import { useTranslations } from "next-intl";
import { useCollaborationStats } from "@/src/hooks/api/useCollaboration";

export default function CollaborationStatsCard({ actorId }: { actorId: string }) {
  const { data: stats, isLoading, isError } = useCollaborationStats(actorId);
  const t = useTranslations("common");

  if (isLoading) return <div className="h-24 bg-gray-100 animate-pulse rounded-lg" />;
  if (isError || !stats) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{t("careerStats")}</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.totalWorks}</div>
          <div className="text-xs text-blue-800 uppercase tracking-wide">{t("totalWorks")}</div>
        </div>

        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{stats.totalCollaborators}</div>
          <div className="text-xs text-purple-800 uppercase tracking-wide">{t("collaborators")}</div>
        </div>

        <div className="p-3 bg-green-50 rounded-lg col-span-2">
          <div className="text-sm text-green-800 mb-1">{t("mostFrequentCollaborator")}</div>
          {stats.mostFrequentCollaborator ? (
            <div className="flex justify-between items-end">
              <span className="font-bold text-lg text-green-700">
                {stats.mostFrequentCollaborator.name}
              </span>
              <span className="text-xs bg-white px-2 py-1 rounded border border-green-200">
                {stats.mostFrequentCollaborator.count} {t("projects")}
              </span>
            </div>
          ) : (
            <span className="text-gray-400 italic">{t("noneFound")}</span>
          )}
        </div>
      </div>
    </div>
  );
}