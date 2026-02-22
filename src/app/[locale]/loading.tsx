"use client";
import { Clapperboard, Film } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Loading() {
  const t = useTranslations("common");

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-pulse" />

      <div className="relative flex flex-col items-center">
        <div className="relative mb-8">
          <Film className="w-16 h-16 text-muted/20 animate-[spin_3s_linear_infinite]" />

          <div className="absolute inset-0 flex items-center justify-center">
            <Clapperboard
              className="w-10 h-10 text-primary animate-[bounce_2s_ease-in-out_infinite]"
              strokeWidth={1.5}
            />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold tracking-widest uppercase text-foreground animate-pulse">
            {t("loading") || "Feature Presentation"}
          </h2>

          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] w-full h-full animate-[shimmer_1.5s_infinite]" />
            <div className="h-full bg-primary animate-[loading-bar_2s_ease-in-out_infinite] w-full origin-left" />
          </div>

          <p className="text-xs text-muted-foreground uppercase tracking-tighter italic">
            Gathering Cast & Crew...
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes loading-bar {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}