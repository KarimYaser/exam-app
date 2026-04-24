"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ChevronsDownUp } from "lucide-react";

interface FiltersPanelProps {
  category: string;
  action: string;
  actorRole: string;
  filtersOpen: boolean;
  onCategoryChange: (value: string) => void;
  onActionChange: (value: string) => void;
  onActorRoleChange: (value: string) => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

const categories = ["DIPLOMA", "EXAM", "QUESTION", "USER"];
const actions = ["CREATE", "UPDATE", "DELETE"];
const roles = [
  { value: "USER", label: "User" },
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

export default function AdminAuditFiltersPanel({
  category,
  action,
  actorRole,
  filtersOpen,
  onCategoryChange,
  onActionChange,
  onActorRoleChange,
  onToggleFilters,
  onClearFilters,
  onApplyFilters,
}: FiltersPanelProps) {
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <select
                value={category}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full h-10 px-3 rounded border border-gray-200 bg-white text-sm text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              >
                <option value="" disabled>
                  Category
                </option>
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={action}
                onChange={(e) => onActionChange(e.target.value)}
                className="w-full h-10 px-3 rounded border border-gray-200 bg-white text-sm text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              >
                <option value="" disabled>
                  Action
                </option>
                <option value="all">All Actions</option>
                {actions.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={actorRole}
                onChange={(e) => onActorRoleChange(e.target.value)}
                className="w-full h-10 px-3 rounded border border-gray-200 bg-white text-sm text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              >
                <option value="" disabled>
                  User
                </option>
                <option value="all">All Users</option>
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
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