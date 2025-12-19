import * as React from "react";
import { cn } from "@/utils/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200/80", className)} // Changed to gray-200 for better visibility if muted isn't defined
      {...props}
    />
  );
}

export function SkeletonAvatar({ className }: { className?: string }) {
  return <Skeleton className={cn("rounded-full flex-shrink-0", className)} />;
}

export function SkeletonText({
  lines = 2,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2 w-full", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", i === lines - 1 ? "w-1/2" : "w-full")}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="flex items-center p-3 bg-white border rounded-xl gap-4">
      <SkeletonAvatar className="h-14 w-14" />
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonRepeat({
  count = 3,
  children,
  className,
}: {
  count?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>{children}</React.Fragment>
      ))}
    </div>
  );
}

export function ActorProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="w-32 h-6 mb-6" />

      <div className="bg-white overflow-hidden rounded-lg border border-gray-100 mb-12">
        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar */}
            <SkeletonAvatar className="w-32 h-32" />

            <div className="flex-1 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <SkeletonText lines={3} />

              {/* Badges */}
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <SkeletonText lines={6} />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-6 w-1/2" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductionProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex-shrink-0">
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
        </div>
        <div className="flex-1 space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <SkeletonText lines={5} className="mt-6" />
        </div>
      </div>

      {/* Cast Grid */}
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-white border rounded-lg overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <div className="p-3">
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonCollaboratorCard() {
  return (
    <div className="flex flex-col items-center p-6 bg-white border rounded-xl shadow-sm h-full">
      <SkeletonAvatar className="w-28 h-28 mb-4 border-4 border-white shadow-sm" />

      <Skeleton className="h-6 w-3/4 mb-4" />

      <Skeleton className="h-5 w-1/2 rounded-full" />
    </div>
  );
}