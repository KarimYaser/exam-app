"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ArrowDownAZ, ArrowUpAZ, ArrowDown, ArrowUp } from "lucide-react";

export type SortKey = "title-asc" | "title-desc" | "newest" | "oldest";

interface AdminDiplomaTableHeaderProps {
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
}

export default function AdminDiplomaTableHeader({
  sort,
  onSortChange,
}: AdminDiplomaTableHeaderProps) {
  return (
    <div className={cn(
      "hidden shrink-0 grid-cols-[56px_1fr_1.2fr_40px] gap-3 border-b border-gray-200 bg-blue-600 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white sm:grid sm:gap-4 sm:px-6",
    )}>
      <span>Image</span>
      <span>Title</span>
      <span>Description</span>
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
              onClick={() => onSortChange("title-asc")}
            >
              <ArrowDownAZ className="mr-2 h-4 w-4" />
              Title (A → Z)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSortChange("title-desc")}
            >
              <ArrowUpAZ className="mr-2 h-4 w-4" />
              Title (Z → A)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSortChange("newest")}
            >
              <ArrowDown className="mr-2 h-4 w-4" />
              Newest
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSortChange("oldest")}
            >
              <ArrowUp className="mr-2 h-4 w-4" />
              Oldest
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}