"use client";

import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, ChevronsDownUp } from "lucide-react";

interface AdminDiplomaFiltersPanelProps {
  search: string;
  immutability: string;
  filtersOpen: boolean;
  immutabilityOptions: string[];
  onSearchChange: (value: string) => void;
  onImmutabilityChange: (value: string) => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

export default function AdminDiplomaFiltersPanel({
  search,
  immutability,
  filtersOpen,
  immutabilityOptions,
  onSearchChange,
  onImmutabilityChange,
  onToggleFilters,
  onClearFilters,
  onApplyFilters,
}: AdminDiplomaFiltersPanelProps) {
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
              className="w-full px-2 h-10 rounded border border-gray-200 bg-white text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <select
                value={immutability}
                onChange={(e) => onImmutabilityChange(e.target.value)}
                className={`lg:w-[326px] w-full h-10 px-3 rounded border border-gray-200 bg-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all capitalize ${
                  immutability === "all" ? "text-gray-800" : "text-gray-400"
                }`}
              >
                {immutabilityOptions.map((c) => (
                  <option key={c} value={c} className="text-gray-800">
                    {c === "all" ? "Immutability" : c}
                  </option>
                ))}
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
