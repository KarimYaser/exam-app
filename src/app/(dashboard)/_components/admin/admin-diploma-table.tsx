"use client";

import { cn } from "@/lib/utils";
import AdminDiplomaCard from "./admin-diploma-card";
import AdminDiplomaTableHeader, { type SortKey } from "./admin-diploma-table-header";

type AdminDiplomaItem = {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: string;
  createdAt: string;
};

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
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500 font-bold animate-pulse">
              Loading diplomas...
            </p>
          </div>
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