export default function AdminDiplomaDetailsSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f4f5f7] font-mono text-[13px] animate-pulse">
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-6 py-3 text-xs">
        <div className="h-3 w-16 rounded bg-gray-200" />
        <div className="h-3 w-2 rounded bg-gray-200" />
        <div className="h-3 w-40 rounded bg-blue-100" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-6">
        <div className="mb-4 flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-10 w-72 max-w-full rounded bg-gray-200" />

          <div className="flex flex-wrap items-center gap-2">
            <div className="h-8 w-28 rounded bg-gray-200" />
            <div className="h-8 w-20 rounded bg-blue-200" />
            <div className="h-8 w-24 rounded bg-red-200" />
          </div>
        </div>

        <div className="rounded border border-gray-200 bg-white p-3 sm:p-4">
          <div className="mb-2 h-3 w-12 rounded bg-gray-200" />
          <div className="mb-5 h-56 w-full max-w-55 rounded border border-gray-200 bg-gray-200 sm:h-60 sm:w-55" />

          <div className="mb-2 h-3 w-10 rounded bg-gray-200" />
          <div className="mb-5 h-8 w-64 max-w-full rounded bg-gray-200" />

          <div className="mb-2 h-3 w-24 rounded bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-full max-w-245 rounded bg-gray-200" />
            <div className="h-4 w-full max-w-240 rounded bg-gray-200" />
            <div className="h-4 w-full max-w-230 rounded bg-gray-200" />
            <div className="h-4 w-full max-w-175 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}