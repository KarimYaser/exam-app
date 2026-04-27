import React from "react";

export default function AdminExamCardSkeleton() {
  return (
    <div className="grid grid-cols-[48px_1fr_auto_40px] sm:grid-cols-[56px_1fr_1fr_120px_40px] items-center gap-2 sm:gap-4 border-b border-gray-100 px-3 py-3 sm:px-4">
      {/* Image Skeleton */}
      <div className="h-12 w-12 animate-pulse bg-gray-200 sm:h-14 sm:w-14" />

      {/* Title & Subtitle Skeleton */}
      <div className="flex min-w-0 flex-col gap-2">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200 sm:hidden" />
      </div>

      {/* Diploma Skeleton (Desktop) */}
      <div className="hidden sm:block">
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Questions Count Skeleton */}
      <div className="flex justify-end sm:justify-start">
        <div className="h-4 w-6 animate-pulse rounded bg-gray-200 sm:w-8" />
      </div>

      {/* Actions Skeleton */}
      <div className="flex justify-end">
        <div className="h-6 w-6 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}
