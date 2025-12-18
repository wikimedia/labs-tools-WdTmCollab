import * as React from "react";
import { cn } from "@/utils/utils";


interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/80",
        className
      )}
      {...props}
    />
  );
}



export function SkeletonAvatar({ size = 14 }: { size?: number }) {
  return (
    <Skeleton
      className={`h-${size} w-${size} rounded-full flex-shrink-0`}
    />
  );
}

export function SkeletonText({
  lines = 2,
}: {
  lines?: number;
}) {
  return (
    <div className="space-y-2 w-full">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 ? "w-1/2" : "w-3/4"
          )}
        />
      ))}
    </div>
  );
}


export function SkeletonCard() {
  return (
    <div className="flex items-center p-3 bg-white border rounded-xl gap-4">
      <SkeletonAvatar />
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center p-3 gap-4">
      <SkeletonAvatar size={10} />
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
