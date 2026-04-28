"use client";

import AdminDiplomaCard from "./admin-diploma-card";
import AdminDiplomaTableHeader, {
  type SortKey,
} from "./admin-diploma-table-header";
import AdminDiplomaCardSkeleton from "./admin-diploma-card-skeleton";
import { Diploma } from "@/lib/types/diplomas";

type AdminDiplomaItem = Diploma;

interface AdminDiplomaTableProps {
  pageItems: AdminDiplomaItem[];
  isLoading: boolean;
  isError: boolean;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
}

export default function AdminDiplomaTable({
  pageItems,
  isLoading,
  isError,
  sort,
  onSortChange,
}: AdminDiplomaTableProps) {
  return (
    <div className="flex flex-col rounded border border-gray-200 bg-white shadow-sm sm:min-h-0 sm:flex-1 sm:overflow-hidden">
      <AdminDiplomaTableHeader sort={sort} onSortChange={onSortChange} />

      <div className="divide-y divide-gray-100 sm:min-h-0 sm:flex-1 sm:overflow-y-auto sm:overscroll-y-contain">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <AdminDiplomaCardSkeleton key={i} />
            ))}
          </>
        ) : isError ? (
          <div className="px-4 py-16 text-center">
            <p className="text-sm text-red-500 font-bold">
              Failed to load diplomas.
            </p>
          </div>
        ) : pageItems.length === 0 ? (
          <div className="px-4 py-20 text-center">
            <p className="text-sm text-gray-500 font-bold">
              No diplomas match your filters.
            </p>
          </div>
        ) : (
          pageItems.map((d) => <AdminDiplomaCard key={d.id} diploma={d} />)
        )}
      </div>
    </div>
  );
}
