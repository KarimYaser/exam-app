import { MoreVertical } from "lucide-react";

export default function AdminDiplomaCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 border-b border-gray-200 bg-gray-100 px-4 py-4 text-sm last:border-b-0 font-mono sm:grid sm:grid-cols-[56px_1fr_1.2fr_40px] sm:items-center sm:gap-4 animate-pulse">
      <div className="relative h-40 w-full shrink-0 overflow-hidden rounded border border-slate-200 bg-slate-200 sm:h-14 sm:w-14"></div>

      <div className="min-w-0">
        <div className="h-5 w-32 bg-slate-200 rounded"></div>
      </div>

      <div className="min-w-0 space-y-2">
        <div className="h-4 w-48 bg-slate-200 rounded"></div>
      </div>

      <div className="flex justify-end sm:self-center">
        <div className="rounded p-1 text-gray-300">
          <MoreVertical className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
