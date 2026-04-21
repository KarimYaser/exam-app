"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  CalendarArrowDown,
  CalendarArrowUp,
  ChevronLeft,
  ChevronRight,
  ListOrdered,
  ListOrderedIcon,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getAdminExams } from "../_actions/exams.actions";
import { AdminExam, AdminExamCardItem } from "../_types/admin-exam";
import AdminExamCard from "./admin-exam-card";

type SortKey =
  | "title-asc"
  | "title-desc"
  | "questions-desc"
  | "questions-asc"
  | "newest-desc"
  | "newest-asc";

const ADMIN_EXAMS_PAGE_SIZE = 10;

function mapExamToCard(exam: AdminExam): AdminExamCardItem {
  return {
    id: exam.id,
    title: exam.title,
    diplomaTitle: exam.diploma?.title || "Unknown Diploma",
    questionsCount: exam._count?.questions ?? exam.questionsCount ?? 0,
    image: exam.image,
  };
}

function applySort(exams: AdminExam[], sort: SortKey): AdminExam[] {
  const copy = [...exams];
  switch (sort) {
    case "title-asc":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "title-desc":
      return copy.sort((a, b) => b.title.localeCompare(a.title));
    case "questions-desc":
      return copy.sort(
        (a, b) =>
          (b._count?.questions ?? b.questionsCount ?? 0) -
          (a._count?.questions ?? a.questionsCount ?? 0),
      );
    case "questions-asc":
      return copy.sort(
        (a, b) =>
          (a._count?.questions ?? a.questionsCount ?? 0) -
          (b._count?.questions ?? b.questionsCount ?? 0),
      );
    case "newest-desc":
      return copy.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      );
    case "newest-asc":
      return copy.sort(
        (a, b) =>
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime(),
      );
    default:
      return copy;
  }
}

export default function AdminExamsDashboard() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [diplomaFilter, setDiplomaFilter] = useState("all");
  const [immutableFilter, setImmutableFilter] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [sort, setSort] = useState<SortKey>("title-desc");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-exams"],
    queryFn: () => getAdminExams(1, 100), // Fetch all exams for client-side filtering and pagination
    retry: 1,
  });

  const exams = useMemo(() => data?.payload?.data ?? [], [data]);

  const diplomaOptions = useMemo(() => {
    const set = new Set(
      exams.map((e) => e.diploma?.title || "Unknown Diploma"),
    );
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [exams]);

  const filtered = useMemo(() => {
    let list = [...exams];

    if (diplomaFilter !== "all") {
      list = list.filter(
        (item) => (item.diploma?.title || "Unknown Diploma") === diplomaFilter,
      );
    }

    if (immutableFilter !== "all") {
      const target = immutableFilter === "immutable";
      list = list.filter((item) => Boolean(item.immutable) === target);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((item) => item.title.toLowerCase().includes(q));
    }

    return applySort(list, sort);
  }, [exams, diplomaFilter, immutableFilter, search, sort]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / ADMIN_EXAMS_PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * ADMIN_EXAMS_PAGE_SIZE;
  const pageItems = filtered.slice(start, start + ADMIN_EXAMS_PAGE_SIZE);
  const rangeFrom = total === 0 ? 0 : start + 1;
  const rangeTo = Math.min(start + ADMIN_EXAMS_PAGE_SIZE, total);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f4f5f7] font-mono text-[13px]">
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-6 py-3">
        <span className="text-xs text-blue-500">Exams</span>
      </div>

      <div className="mb-4 flex shrink-0 flex-col gap-3 rounded border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-gray-500">
            {total === 0
              ? "0 results"
              : `${rangeFrom} - ${rangeTo} of ${total}`}
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
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button className="border-0 rounded-none bg-[#00BC7D] text-white hover:bg-[#00a16a]">
          <Link href="/exams/new" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Create New Exam
          </Link>
        </Button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-6">
        <div className="mb-4 shrink-0 rounded border border-gray-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            className="flex w-full items-center justify-between bg-[#155DFC] px-4 py-2.5 text-left text-sm font-medium text-white"
          >
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Search &amp; Filters
            </span>
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
                  className="w-full rounded border border-gray-200 bg-white py-2.5 pl-3 pr-10 text-sm text-gray-800 outline-none focus:border-[#155DFC] focus:ring-2 focus:ring-blue-100"
                />
                <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:max-w-2xl">
                  <div>
                    <label
                      htmlFor="exam-filter-diploma"
                      className="mb-1.5 block text-xs font-medium text-gray-600"
                    >
                      Diploma
                    </label>
                    <select
                      id="exam-filter-diploma"
                      value={diplomaFilter}
                      onChange={(e) => {
                        setDiplomaFilter(e.target.value);
                        setPage(1);
                      }}
                      className="h-10 w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#155DFC] focus:ring-2 focus:ring-blue-100"
                    >
                      {diplomaOptions.map((option) => (
                        <option key={option} value={option}>
                          {option === "all" ? "All Diplomas" : option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="exam-filter-immutable"
                      className="mb-1.5 block text-xs font-medium text-gray-600"
                    >
                      Immutability
                    </label>
                    <select
                      id="exam-filter-immutable"
                      value={immutableFilter}
                      onChange={(e) => {
                        setImmutableFilter(e.target.value);
                        setPage(1);
                      }}
                      className="h-10 w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#155DFC] focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="all">All</option>
                      <option value="immutable">Immutable</option>
                      <option value="mutable">Mutable</option>
                    </select>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2 sm:justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setSearch("");
                      setDiplomaFilter("all");
                      setImmutableFilter("all");
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

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
          <div className="grid shrink-0 grid-cols-[56px_1fr_1fr_120px_72px] items-center gap-3 border-b border-gray-200 bg-[#155DFC] px-3 py-2.5 text-xs font-medium uppercase tracking-wide text-white sm:gap-4 sm:px-4">
            <span>Image</span>
            <span>Title</span>
            <span>Diploma</span>
            <span>No. of Questions</span>
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 normal-case text-white hover:bg-blue-500">
                  Sort
                  <ArrowDownAZ className="h-3.5 w-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="font-sans text-sm bg-white"
                >
                  <DropdownMenuItem onClick={() => setSort("title-desc")}>
                    <ArrowUpAZ className="h-4 w-4" />
                    Title (descending)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSort("title-asc")}>
                    <ArrowDownAZ className="h-4 w-4" />
                    Title (ascending)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSort("questions-desc")}>
                    <ListOrdered className="h-4 w-4" />
                    Questions No. (descending)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSort("questions-asc")}>
                    <ListOrderedIcon className="h-4 w-4" />
                    Questions No. (ascending)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSort("newest-desc")}>
                    <CalendarArrowDown className="h-4 w-4" />
                    Newest (descending)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSort("newest-asc")}>
                    <CalendarArrowUp className="h-4 w-4" />
                    Newest (ascending)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {isLoading ? (
              <p className="px-4 py-10 text-center text-sm text-gray-500">
                Loading exams...
              </p>
            ) : isError ? (
              <p className="px-4 py-10 text-center text-sm text-red-500">
                Failed to load exams.
              </p>
            ) : pageItems.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-gray-500">
                No exams match your filters.
              </p>
            ) : (
              pageItems.map((exam) => (
                <AdminExamCard key={exam.id} exam={mapExamToCard(exam)} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
