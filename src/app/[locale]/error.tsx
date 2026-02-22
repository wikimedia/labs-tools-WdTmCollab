"use client";

import { useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="flex-grow bg-background">
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg mx-auto">
          <div className="bg-card rounded-xl shadow-lg border border-border p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-destructive/10 rounded-full mb-6">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-foreground">
                {t("pageTitle")}
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                {t("pageDescription")}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button onClick={reset} className="flex-1" size="lg">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {t("tryAgain")}
                </Button>
                <Button
                  onClick={() => window.location.href = "/"}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  <Home className="mr-2 h-4 w-4" />
                  {t("goHome")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}