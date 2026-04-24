"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eraser } from "lucide-react";

interface PaginationBarProps {
  page: number;
  pageCount: number;
  total: number;
  rangeFrom: number;
  rangeTo: number;
  isLoading: boolean;
  isSuperAdminUser: boolean;
  totalLogs: number;
  isClearing: boolean;
  onPageChange: (page: number) => void;
  onClearLogs: () => void;
}

export default function AdminAuditPaginationBar({
  page,
  pageCount,
  total,
  rangeFrom,
  rangeTo,
  isLoading,
  isSuperAdminUser,
  totalLogs,
  isClearing,
  onPageChange,
  onClearLogs,
}: PaginationBarProps) {
  return (
    <div className="px-4 py-3 sticky top-0 left-0 right-0 flex flex-col gap-3 sm:flex-row bg-white sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3 ">
        <span className="text-xs text-gray-500 font-bold px-3 py-2 ">
          {total === 0
            ? "0 results"
            : `${rangeFrom} - ${rangeTo} of ${total}`}
        </span>
        <div className="flex items-center  text-gray-400 border-t border-b border-gray-100">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 bg-gray-200 hover:bg-gray-300 border-0 rounded-none cursor-pointer ${page <= 1 || isLoading ? "opacity-50" : "*:text-gray-600"}`}
            disabled={page <= 1 || isLoading}
            onClick={() => onPageChange(Math.max(1, page - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center px-2 py-1  text-xs text-gray-600 font-bold ">
            Page {page} of {pageCount}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 bg-gray-200 hover:bg-gray-300 border-0 rounded-none cursor-pointer ${page >= pageCount || isLoading ? "opacity-50" : "*:text-gray-600"}`}
            disabled={page >= pageCount || isLoading}
            onClick={() => onPageChange(Math.min(pageCount, page + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {isSuperAdminUser && (
        <Button
          type="button"
          variant="destructive"
          className="bg-red-500 hover:bg-red-600 text-white h-10 max-w-36 px-1 rounded-none text-xs flex items-center gap-2 transition-all disabled:opacity-50"
          onClick={onClearLogs}
          disabled={isClearing || totalLogs === 0}
        >
          <Eraser className="h-4 w-4" />
          Clear All Logs
        </Button>
      )}
    </div>
  );
}