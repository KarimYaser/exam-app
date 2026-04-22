"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowDownAZ,
  ArrowUp,
  ArrowUpAZ,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import AdminDiplomaCard from "./admin-diploma-card";
import {
  ADMIN_DIPLOMAS_PAGE_SIZE,
  type AdminDiplomaMock,
} from "./admin-diplomas.mock";
import { useRouter } from "next/navigation";
import type { Diploma } from "../../_actions/diplomas.actions";
import Link from "next/link";
import useAdminDiplomasList from "../../_hooks/use-admin-diplomas-list";

type SortKey = "title-asc" | "title-desc" | "newest" | "oldest";

function applySort(items: AdminDiplomaMock[], sort: SortKey): AdminDiplomaMock[] {
  const copy = [...items];
  switch (sort) {
    case "title-asc":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "title-desc":
      return copy.sort((a, b) => b.title.localeCompare(a.title));
    case "newest":
      return copy.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case "oldest":
      return copy.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    default:
      return copy;
  }
}

function mapDiplomaToAdminItem(diploma: Diploma): AdminDiplomaMock {
  return {
    id: diploma.id,
    title: diploma.title,
    description: diploma.description,
    image: diploma.image,
    category: "General",
    createdAt: diploma.createdAt,
  };
}

export default function AdminDiplomasDashboard() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [sort, setSort] = useState<SortKey>("title-asc");
  const router = useRouter();
  const { data, isLoading, isError } = useAdminDiplomasList();

  const diplomas = useMemo(() => {
    const apiItems: Diploma[] = data ?? [];
    return apiItems.map(mapDiplomaToAdminItem);
  }, [data]);

  const categories = useMemo(() => {
    const set = new Set(diplomas.map((d) => d.category));
    return ["all", ...Array.from(set).sort()];
  }, [diplomas]);

  const filtered = useMemo(() => {
    let list = [...diplomas];
    if (category !== "all") {
      list = list.filter((d) => d.category === category);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q),
      );
    }
    return applySort(list, sort);
  }, [diplomas, search, category, sort]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / ADMIN_DIPLOMAS_PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * ADMIN_DIPLOMAS_PAGE_SIZE;
  const pageItems = filtered.slice(start, start + ADMIN_DIPLOMAS_PAGE_SIZE);
  const rangeFrom = total === 0 ? 0 : start + 1;
  const rangeTo = Math.min(start + ADMIN_DIPLOMAS_PAGE_SIZE, total);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f4f5f7] font-mono text-[13px]">
      {/* breadcrumb header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-6 py-3">
        <span
          className="cursor-pointer text-xs text-[#155DFC] hover:underline"
          onClick={() => router.push("/")}
        >
          Diplomas
        </span>
      </div>

      {/* toolbar + filters: stay visible; list scrolls independently below */}
        <div className="mb-4 flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded border border-gray-100">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-gray-500">
              {total === 0
                ? "0 results"
                : `${rangeFrom} – ${rangeTo} of ${total}`}
            </span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="border-gray-300"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-28 text-center text-xs text-gray-600">
                Page {safePage} of {pageCount}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="border-gray-300"
                disabled={safePage >= pageCount}
                onClick={() =>
                  setPage((p) => Math.min(pageCount, p + 1))
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
            <Button
              type="button"
              className="border-0 bg-[#00BC7D] rounded-none text-white hover:bg-teal-600"
            >
              <Link href="/new-diploma" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Add Diploma
              </Link>
            </Button>
        </div>
      <div className="flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-6">

        <div className="mb-4 shrink-0 rounded border border-gray-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className="flex w-full items-center justify-between bg-blue-600 px-4 py-2.5 text-left text-sm font-medium text-white"
          >
            <span>Search &amp; Filters</span>
            <span className="text-xs">{filtersOpen ? "Hide" : "Show"}</span>
          </button>
          {filtersOpen && (
            <div className="space-y-4 border-t border-gray-100 p-4 sm:p-5">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search by title"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded border border-gray-200 bg-white py-2.5 pl-3 pr-10 text-sm text-gray-800 outline-none ring-sky-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                />
                <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="w-full min-w-0 sm:max-w-md">
                  <label
                    htmlFor="admin-diploma-category"
                    className="mb-1.5 block text-xs font-medium text-gray-600"
                  >
                    Department / category
                  </label>
                  <select
                    id="admin-diploma-category"
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setPage(1);
                    }}
                    className="h-10 w-full min-w-0 rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c === "all" ? "All categories" : c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setSearch("");
                      setCategory("all");
                      setPage(1);
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                    onClick={() => setPage(1)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table: header fixed, rows scroll */}
        <div className="flex flex-col rounded border border-gray-200 bg-white shadow-sm sm:min-h-0 sm:flex-1 sm:overflow-hidden">
          <div
            className={cn(
              "hidden shrink-0 grid-cols-[56px_1fr_1.2fr_40px] gap-3 border-b border-gray-200 bg-blue-600 px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-white sm:grid sm:gap-4",
            )}
          >
            <span>Image</span>
            <span>Title</span>
            <span>Description</span>
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 normal-case text-white hover:bg-gray-200 hover:text-gray-800 focus:outline-none cursor-pointer focus:ring-2 focus:ring-sky-400 focus:ring-offset-2">  
                  Sort
                  <ArrowDownAZ className="h-3.5 w-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="font-sans text-sm">
                  <DropdownMenuItem
                    onClick={() => {
                      setSort("title-asc");
                      setPage(1);
                    }}
                  >
                    <ArrowDownAZ className="h-4 w-4" />
                    Title (A → Z)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSort("title-desc");
                      setPage(1);
                    }}
                  >
                    <ArrowUpAZ className="h-4 w-4" />
                    Title (Z → A)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSort("newest");
                      setPage(1);
                    }}
                  >
                    <ArrowDown className="h-4 w-4" />
                    Newest
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSort("oldest");
                      setPage(1);
                    }}
                  >
                    <ArrowUp className="h-4 w-4" />
                    Oldest
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="divide-y divide-gray-100 sm:min-h-0 sm:flex-1 sm:overflow-y-auto sm:overscroll-y-contain">
            {isLoading ? (
              <p className="px-4 py-10 text-center text-sm text-gray-500">
                Loading diplomas...
              </p>
            ) : isError ? (
              <p className="px-4 py-10 text-center text-sm text-red-500">
                Failed to load diplomas.
              </p>
            ) : pageItems.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-gray-500">
                No diplomas match your filters.
              </p>
            ) : (
              pageItems.map((d) => <AdminDiplomaCard key={d.id} diploma={d} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
