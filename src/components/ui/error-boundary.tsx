"use client";

import React, { useEffect, ErrorInfo, ReactNode, useState } from "react";
import { Button } from "./button";
import { AlertTriangle, RefreshCw, Home, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [errorState, setErrorState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
    errorInfo: null,
  });

  const t = useTranslations("common");

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error("Uncaught error:", error.error);
      setErrorState({
        hasError: true,
        error: error.error,
        errorInfo: null,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason);
      setErrorState({
        hasError: true,
        error: event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        errorInfo: null,
      });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  const handleReset = () => {
    setErrorState({ hasError: false, error: null, errorInfo: null });
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleReload = () => {
    window.location.reload();
  };

  if (errorState.hasError) {
    if (fallback) return fallback;

    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-muted/30 px-4">
        <div className="max-w-md w-full bg-background shadow-xl border rounded-xl p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">

          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {t("errorTitle")}
            </h1>
            <p className="text-muted-foreground text-sm">
              {t("errorDescription")}
            </p>
          </div>

          {/* Dev Details */}
          {process.env.NODE_ENV === "development" && errorState.error && (
            <div className="text-left bg-muted/50 rounded-lg p-4 overflow-auto max-h-40 border text-xs font-mono">
              <p className="text-destructive font-semibold mb-2">
                {errorState.error.name}: {errorState.error.message}
              </p>
              <p className="text-muted-foreground opacity-70">
                Check console for full stack trace.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Button onClick={handleReset} className="w-full sm:col-span-2">
              <RotateCcw className="mr-2 h-4 w-4" /> {t("tryAgain")}
            </Button>
            <Button onClick={handleReload} variant="outline" className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" /> {t("reload")}
            </Button>
            <Button onClick={handleGoHome} variant="outline" className="w-full">
              <Home className="mr-2 h-4 w-4" /> {t("goHome")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default ErrorBoundary;
