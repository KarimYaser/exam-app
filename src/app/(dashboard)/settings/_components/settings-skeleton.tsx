import React from "react";

export default function SettingsSkeleton() {
  return (
    <div className="flex flex-col h-full bg-gray-50 min-h-screen font-mono">
      {/* Breadcrumb Header Skeleton */}
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-100 bg-white px-4 py-2 sm:px-12">
        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
        <span className="text-xs text-gray-300">/</span>
        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 w-full">
        <div className="flex flex-col gap-4 h-full">
          <div className="max-w-6xl mx-auto w-full ">
            {/* Header row skeleton */}
            <div className="*:h-16 md:*:h-19 flex justify-center items-start gap-2 mb-2 shrink-0">
              <div className="flex justify-center items-center border-[1.5px] border-blue-200 bg-white p-2 w-16 md:w-19">
                <div className="h-8 w-8 bg-blue-100 rounded animate-pulse" />
              </div>
              <div className="flex grow items-center gap-3 bg-blue-400 px-5 py-3 mb-2 animate-pulse">
                <div className="h-10 w-10 bg-blue-300 rounded-full hidden sm:block" />
                <div className="h-8 w-48 bg-blue-300 rounded" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 lg:gap-10 mt-6 flex-1">
              {/* Sidebar Navigation Skeleton */}
              <aside className="w-full md:w-64 lg:w-72 shrink-0">
                <div className="flex md:flex-col overflow-x-auto md:overflow-visible gap-2 pb-2 md:pb-0 border-b md:border-none border-gray-100">
                  <div className="h-12 w-32 md:w-full bg-blue-50 rounded-md animate-pulse" />
                  <div className="h-12 w-32 md:w-full bg-gray-100 rounded-md animate-pulse" />
                </div>
                <div className="hidden md:block h-12 w-full mt-8 bg-red-50 rounded-md animate-pulse" />
              </aside>

              {/* Main Content Area Skeleton */}
              <main className="flex-1 bg-white p-5 sm:p-8 md:p-10 shadow-sm border border-gray-100 rounded-lg min-w-0 h-fit">
                {/* Profile Photo Skeleton */}
                <div className="mb-10 w-full animate-pulse">
                  <div className="flex justify-between items-center mb-6">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="h-32 w-32 rounded-full border border-dashed border-gray-300 bg-gray-100" />
                    <div className="h-3 w-48 bg-gray-200 rounded" />
                  </div>
                </div>

                {/* Form Inputs Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-12 w-full bg-gray-50 border border-gray-200 rounded" />
                  </div>
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-12 w-full bg-gray-50 border border-gray-200 rounded" />
                  </div>
                </div>
                
                <div className="space-y-2 animate-pulse mb-8">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-12 w-full bg-gray-50 border border-gray-200 rounded" />
                </div>

                {/* Save Button Skeleton */}
                <div className="flex justify-end animate-pulse mt-8">
                  <div className="h-12 w-32 bg-blue-100 rounded" />
                </div>

                {/* Mobile Logout Button Skeleton */}
                <div className="md:hidden h-12 w-full mt-8 bg-red-50 rounded-md animate-pulse" />
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
