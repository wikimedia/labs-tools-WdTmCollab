"use client";

import { Link } from "../../i18n/routing"; // Use your i18n Link
import { useRouter } from "next/navigation";
import { FileQuestion, MoveLeft, Home } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const router = useRouter();
  const t = useTranslations("notFound");

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center space-y-8 animate-in fade-in zoom-in-95 duration-300 bg-background">
      <div className="relative">
        <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl"></div>
        <div className="relative bg-card p-6 rounded-full shadow-lg border border-border">
          <FileQuestion className="w-16 h-16 text-primary" />
        </div>
      </div>

      <div className="space-y-4 max-w-md">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          {t("title")}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="w-full sm:w-auto min-w-[140px]"
        >
          <MoveLeft className="mr-2 h-4 w-4" />
          {t("goBack")}
        </Button>

        <Link href="/" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto min-w-[140px] bg-primary text-primary-foreground">
            <Home className="mr-2 h-4 w-4" />
            {t("backToHome")}
          </Button>
        </Link>
      </div>

      <div className="pt-8 border-t border-border w-full max-w-md">
        <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-4">
          {t("popularDestinations")}
        </p>
        <div className="flex justify-center gap-6 text-sm font-medium">
          <Link href="/actors" className="text-primary hover:underline">
            {t("findActors")}
          </Link>
          <Link href="/compare" className="text-primary hover:underline">
            {t("compare")}
          </Link>
          <Link href="/clusters" className="text-primary hover:underline">
            {t("clusters")}
          </Link>
        </div>
      </div>
    </div>
  );
}