"use client";

import { useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { useTranslations } from "next-intl";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations("error");

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="flex-grow">
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg mx-auto">
          {/* Error Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full mb-6">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {t("pageTitle")}
              </h1>

              <p className="text-gray-600 leading-relaxed">
                {t("pageDescription")}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={reset}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  size="lg"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {t("tryAgain")}
                </Button>

                <Button
                  onClick={() => window.location.href = "/"}
                  variant="outline"
                  className="flex-1 border-gray-300 hover:bg-gray-50 shadow-sm"
                  size="lg"
                >
                  <Home className="mr-2 h-4 w-4" />
                  {t("goHome")}
                </Button>
              </div>
            </div>
          </div>

          {/* Development Error Details */}
          {process.env.NODE_ENV === "development" && (
            <details className="mt-6 bg-gray-900 text-gray-100 rounded-lg overflow-hidden">
              <summary className="cursor-pointer p-4 bg-gray-800 hover:bg-gray-700 transition-colors font-medium">
                🔧 {t("errorDetails")}
              </summary>
              <div className="p-4 border-t border-gray-700">
                <pre className="text-xs overflow-auto whitespace-pre-wrap text-red-300">
                  {error.message}
                  {error.stack && `\n\n${error.stack}`}
                </pre>
              </div>
            </details>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              {t("contactSupport")}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}