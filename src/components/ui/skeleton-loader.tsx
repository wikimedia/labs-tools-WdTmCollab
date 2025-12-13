import React from "react";

interface SkeletonActorCardProps {
  count?: number;
}

export function SkeletonActorCard({ count = 1 }: SkeletonActorCardProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className='flex flex-col items-center bg-white rounded-xl p-6 shadow-md'
        >
          <div className='w-28 h-28 bg-gray-300 rounded-full animate-pulse mb-4' />
          <div className='w-3/4 h-6 bg-gray-300 rounded animate-pulse mb-2' />
          <div className='w-1/2 h-4 bg-gray-300 rounded animate-pulse mb-4' />
          <div className='w-32 h-6 bg-gray-300 rounded-full animate-pulse' />
        </div>
      ))}
    </>
  );
}

interface SkeletonProductionCardProps {
  count?: number;
}

export function SkeletonProductionCard({
  count = 1
}: SkeletonProductionCardProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className='p-4 border rounded-lg shadow-md bg-white flex flex-col'
        >
          <div className='w-full h-48 bg-gray-300 rounded animate-pulse mb-4' />
          <div className='flex flex-col flex-grow'>
            <div className='w-3/4 h-6 bg-gray-300 rounded animate-pulse mb-2' />
            <div className='w-full h-4 bg-gray-300 rounded animate-pulse mb-2' />
            <div className='w-1/2 h-4 bg-gray-300 rounded animate-pulse mb-2' />
            <div className='w-20 h-4 bg-gray-300 rounded animate-pulse mt-auto' />
          </div>
        </div>
      ))}
    </>
  );
}

interface SkeletonListProps {
  count?: number;
  type: "actor" | "production";
}

export default function SkeletonLoader({ count = 6, type }: SkeletonListProps) {
  return (
    <div
      className={`grid gap-4 ${
        type === "actor"
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      }`}
    >
      {type === "actor" ? (
        <SkeletonActorCard count={count} />
      ) : (
        <SkeletonProductionCard count={count} />
      )}
    </div>
  );
}
