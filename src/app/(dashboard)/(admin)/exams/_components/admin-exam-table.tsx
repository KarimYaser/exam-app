"use client";

import { AdminExam, AdminExamCardItem } from "../_types/admin-exam";
import AdminExamCard from "./admin-exam-card";
import AdminExamCardSkeleton from "./admin-exam-card-skeleton";
import AdminExamTableHeader, { type SortKey } from "./admin-exam-table-header";

interface AdminExamTableProps {
  exams: AdminExam[];
  pageItems: AdminExamCardItem[];
  isLoading: boolean;
  isError: boolean;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
}

export default function AdminExamTable({
  exams,
  pageItems,
  isLoading,
  isError,
  sort,
  onSortChange,
}: AdminExamTableProps) {
  return (
    <div className="flex flex-col rounded border border-gray-200 bg-white shadow-sm sm:min-h-0 sm:flex-1 sm:overflow-hidden">
      <AdminExamTableHeader sort={sort} onSortChange={onSortChange} />

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col w-full">
            {Array.from({ length: 6 }).map((_, i) => (
              <AdminExamCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="px-4 py-16 text-center">
            <p className="text-sm text-red-500 font-bold">
              Failed to load exams.
            </p>
          </div>
        ) : pageItems.length === 0 ? (
          <div className="px-4 py-20 text-center">
            <p className="text-sm text-gray-500 font-bold">
              No exams match your filters.
            </p>
          </div>
        ) : (
          pageItems.map((exam) => <AdminExamCard key={exam.id} exam={exam} />)
        )}
      </div>
    </div>
  );
}
