"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ArrowDownAZ, ArrowUpAZ, ArrowDown, ArrowUp } from "lucide-react";

export type SortKey =
  | "actorUsername-asc"
  | "actorUsername-desc"
  | "entityType-asc"
  | "entityType-desc"
  | "newest"
  | "oldest";

interface TableHeaderProps {
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
}

export default function AdminAuditTableHeader({ sort, onSortChange }: TableHeaderProps) {
  return (
    <div className="hidden shrink-0 grid-cols-[1fr_1.5fr_1.5fr_1.2fr_40px] gap-3 border-b border-gray-200 bg-blue-600 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white sm:grid sm:gap-4 sm:px-6">
      <span>Action</span>
      <span>User</span>
      <span>Entity</span>
      <span>Time</span>
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded px-2 py-0.5 normal-case text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20">
            <span>Sort</span>
            <ArrowDownAZ className="h-3.5 w-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 font-mono bg-white"
          >
            <DropdownMenuItem
              onClick={() => onSortChange("newest")}
              className={
                sort === "newest"
                  ? "bg-blue-50 text-blue-700 font-bold"
                  : ""
              }
            >
              <ArrowDown className="mr-2 h-4 w-4" /> Newest (desc)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSortChange("oldest")}
              className={cn(
                sort === "oldest" && "bg-blue-50 text-blue-700 font-bold",
              )}
            >
              <ArrowUp className="mr-2 h-4 w-4" /> Oldest (asc)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSortChange("actorUsername-asc")}
              className={cn(
                sort === "actorUsername-asc" &&
                  "bg-blue-50 text-blue-700 font-bold",
              )}
            >
              <ArrowDownAZ className="mr-2 h-4 w-4" /> User (A-Z)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSortChange("actorUsername-desc")}
              className={cn(
                sort === "actorUsername-desc" &&
                  "bg-blue-50 text-blue-700 font-bold",
              )}
            >
              <ArrowUpAZ className="mr-2 h-4 w-4" /> User (Z-A)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}