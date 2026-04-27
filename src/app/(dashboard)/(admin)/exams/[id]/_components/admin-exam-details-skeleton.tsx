import React from "react";

export default function AdminExamDetailsSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f4f5f7] font-mono text-[13px] overflow-y-auto">
      {/* Header Skeleton */}
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4 py-3 text-xs sm:px-6">
        <div className="h-4 w-12 rounded bg-gray-200 animate-pulse" />
        <span className="text-gray-300">/</span>
        <div className="h-4 w-48 rounded bg-gray-200 animate-pulse" />
      </div>

      <div className="mb-4 flex flex-col gap-3 border-b border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3">
          <div className="h-8 w-64 sm:w-96 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-48 rounded bg-gray-200 animate-pulse" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="h-7 w-24 rounded bg-gray-200 animate-pulse" />
          <div className="h-7 w-16 rounded bg-[#D0DFFF] animate-pulse" />
          <div className="h-7 w-20 rounded bg-[#FCA5A5] animate-pulse" />
        </div>
      </div>

      <div className="px-4 py-4 sm:px-6">
        {/* Info Card Skeleton */}
        <div className="mb-4 rounded border border-gray-200 bg-white p-3 sm:p-4">
          <div className="mb-1 text-xs font-medium text-gray-400">Image</div>
          <div className="mb-4 h-56 w-full lg:max-w-55 overflow-hidden border border-gray-200 bg-gray-100 animate-pulse sm:h-60 sm:w-55" />

          <div className="mb-1 text-xs font-medium text-gray-400">Title</div>
          <div className="mb-4 h-6 w-3/4 rounded bg-gray-200 animate-pulse" />

          <div className="mb-1 text-xs font-medium text-gray-400">Description</div>
          <div className="mb-4 h-16 w-full max-w-250 rounded bg-gray-200 animate-pulse" />

          <div className="mb-1 text-xs font-medium text-gray-400">Diploma</div>
          <div className="mb-4 h-5 w-48 rounded bg-gray-200 animate-pulse" />

          <div className="mb-1 text-xs font-medium text-gray-400">Duration</div>
          <div className="mb-4 h-5 w-24 rounded bg-gray-200 animate-pulse" />

          <div className="mb-1 text-xs font-medium text-gray-400">
            No. of Questions
          </div>
          <div className="h-5 w-8 rounded bg-gray-200 animate-pulse" />
        </div>

        {/* Questions List Skeleton Placeholder */}
        <div className="rounded border border-gray-200 bg-white p-4 sm:p-6 mt-4">
          <div className="mb-6 flex items-center justify-between">
            <div className="h-6 w-32 rounded bg-gray-200 animate-pulse" />
            <div className="h-8 w-24 rounded bg-[#D0DFFF] animate-pulse" />
          </div>
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 w-full rounded border border-gray-200 bg-gray-50 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
