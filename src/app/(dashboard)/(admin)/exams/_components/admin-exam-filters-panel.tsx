"use client";

import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, ChevronsDownUp } from "lucide-react";

interface AdminExamFiltersPanelProps {
  search: string;
  diplomaFilter: string;
  immutableFilter: string;
  filtersOpen: boolean;
  diplomaOptions: string[];
  onSearchChange: (value: string) => void;
  onDiplomaFilterChange: (value: string) => void;
  onImmutableFilterChange: (value: string) => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

export default function AdminExamFiltersPanel({
  search,
  diplomaFilter,
  immutableFilter,
  filtersOpen,
  diplomaOptions,
  onSearchChange,
  onDiplomaFilterChange,
  onImmutableFilterChange,
  onToggleFilters,
  onClearFilters,
  onApplyFilters,
}: AdminExamFiltersPanelProps) {
  return (
    <div className="mb-4 shrink-0 border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex w-full items-center justify-between bg-blue-600 px-4 py-2.5 text-left text-sm font-bold text-white">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} />
          <span>Search & Filters</span>
        </div>
        <div
          className="flex items-center gap-1 text-[11px] uppercase cursor-pointer text-white "
          onClick={onToggleFilters}
        >
          <ChevronsDownUp
            size={12}
            className={`transition-transform duration-300 ${!filtersOpen && "rotate-180"}`}
          />
          <span>{filtersOpen ? "Hide" : "Show"}</span>
        </div>
      </div>

      {filtersOpen && (
        <div className="p-4 sm:p-5">
          <div className="relative mb-4">
            <input
              type="search"
              placeholder="Search by title"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-10 px-3 rounded border border-gray-200 bg-white text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 pl-10"
            />
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
            <div>
              <select
                value={diplomaFilter}
                onChange={(e) => onDiplomaFilterChange(e.target.value)}
                className="w-full h-10 px-3 rounded border border-gray-200 bg-white text-sm text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              >
                {diplomaOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === "all" ? "All Diplomas" : option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={immutableFilter}
                onChange={(e) => onImmutableFilterChange(e.target.value)}
                className={`w-full h-10 px-3 rounded border border-gray-200 bg-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all capitalize ${
                  immutableFilter === "all" ? "text-gray-400" : "text-gray-800"
                }`}
              >
                {/* <option value="" disabled className="text-gray-400"></option> */}
                <option value="all" className="text-gray-800">
                  All Mutable and Immutable
                </option>
                <option value="immutable" className="text-gray-800">
                  Immutable
                </option>
                <option value="mutable" className="text-gray-800">
                  Mutable
                </option>
              </select>
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 font-bold"
              onClick={onClearFilters}
            >
              Clear
            </Button>
            <Button
              className="bg-gray-200 text-gray-800 hover:bg-gray-300 font-bold px-6 rounded-none"
              onClick={onApplyFilters}
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
