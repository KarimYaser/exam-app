"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

interface AdminDiplomaPaginationBarProps {
  page: number;
  pageCount: number;
  total: number;
  rangeFrom: number;
  rangeTo: number;
  onPageChange: (page: number) => void;
}

export default function AdminDiplomaPaginationBar({
  page,
  pageCount,
  total,
  rangeFrom,
  rangeTo,
  onPageChange,
}: AdminDiplomaPaginationBarProps) {
  return (
    <div className="px-4 py-3 flex flex-col gap-3 sm:flex-row bg-white sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3 ">
        <span className="text-xs text-gray-500 font-bold px-3 py-2 ">
          {total === 0
            ? "0 results"
            : `${rangeFrom} – ${rangeTo} of ${total}`}
        </span>
        <div className="flex items-center  text-gray-400 border-t border-b border-gray-100">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`h-8 w-8 bg-gray-200 hover:bg-gray-300 border-0 rounded-none cursor-pointer ${page <= 1 ? "opacity-50" : "*:text-gray-600"}`}
            disabled={page <= 1}
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
            className={`h-8 w-8 bg-gray-200 hover:bg-gray-300 border-0 rounded-none cursor-pointer ${page >= pageCount ? "opacity-50" : "*:text-gray-600"}`}
            disabled={page >= pageCount}
            onClick={() => onPageChange(Math.min(pageCount, page + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Button className="border-0 rounded-none bg-[#00BC7D] text-white hover:bg-[#00a16a]">
        <Link href="/new-diploma" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Diploma
        </Link>
      </Button>
    </div>
  );
}