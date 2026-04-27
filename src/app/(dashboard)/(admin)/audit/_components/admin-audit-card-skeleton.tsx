import React from "react";

export default function AdminAuditCardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-[1fr_1.5fr_1.5fr_1.2fr_40px] sm:gap-4 sm:px-6 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 cursor-pointer">
      {/* Action Column */}
      <div className="flex flex-col justify-center gap-1.5">
        <div className="h-4 w-16 bg-gray-200 animate-pulse rounded" />
        <div className="h-3 w-20 bg-gray-200 animate-pulse rounded" />
      </div>

      {/* User Column */}
      <div className="flex flex-col justify-center min-w-0 gap-1.5">
        <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
        <div className="h-3 w-40 bg-gray-200 animate-pulse rounded" />
        <div className="h-3 w-16 bg-gray-200 animate-pulse rounded mt-0.5" />
      </div>

      {/* Entity Column */}
      <div className="flex flex-col justify-center min-w-0 gap-1.5">
        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
        <div className="flex items-center gap-1">
          <div className="h-3 w-32 bg-gray-200 animate-pulse rounded" />
          <div className="h-3 w-3 bg-gray-200 animate-pulse rounded" />
        </div>
      </div>

      {/* Time Column */}
      <div className="flex flex-col justify-center gap-1.5">
        <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
        <div className="h-3 w-24 bg-gray-200 animate-pulse rounded" />
      </div>

      {/* Actions Dropdown */}
      <div className="flex items-center justify-end">
        <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-md" />
      </div>
    </div>
  );
}
