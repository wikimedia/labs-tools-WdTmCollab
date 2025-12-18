"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./button";
import { AlertTriangle, RefreshCw, Home, RotateCcw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = (): void => {
    window.location.href = "/";
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-muted/30 px-4">
          <div className="max-w-md w-full bg-background shadow-xl border rounded-xl p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">

            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Something went wrong
              </h1>
              <p className="text-muted-foreground text-sm">
                We encountered an unexpected error. The application has caught it to prevent a crash.
              </p>
            </div>

            {/* Dev Details */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="text-left bg-muted/50 rounded-lg p-4 overflow-auto max-h-40 border text-xs font-mono">
                <p className="text-destructive font-semibold mb-2">
                  {this.state.error.name}: {this.state.error.message}
                </p>
                <p className="text-muted-foreground opacity-70">
                  Check console for full stack trace.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="grid gap-3 sm:grid-cols-2">
              <Button onClick={this.handleReset} className="w-full sm:col-span-2">
                <RotateCcw className="mr-2 h-4 w-4" /> Try Again
              </Button>
              <Button onClick={this.handleReload} variant="outline" className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" /> Reload
              </Button>
              <Button onClick={this.handleGoHome} variant="outline" className="w-full">
                <Home className="mr-2 h-4 w-4" /> Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;