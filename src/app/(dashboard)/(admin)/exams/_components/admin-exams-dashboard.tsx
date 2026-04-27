"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminExams } from "../_actions/exams.actions";
import { AdminExam } from "../_types/admin-exam";
import AdminExamPaginationBar from "./admin-exam-pagination-bar";
import AdminExamFiltersPanel from "./admin-exam-filters-panel";
import AdminExamTable from "./admin-exam-table";
import { SortKey } from "./admin-exam-table-header";

const ADMIN_EXAMS_PAGE_SIZE = 10;

function mapExamToCard(exam: AdminExam) {
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
  const [sort, setSort] = useState<SortKey>("newest-desc");

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
  const pageItems = filtered
    .slice(start, start + ADMIN_EXAMS_PAGE_SIZE)
    .map(mapExamToCard);
  const rangeFrom = total === 0 ? 0 : start + 1;
  const rangeTo = Math.min(start + ADMIN_EXAMS_PAGE_SIZE, total);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleDiplomaFilterChange = (value: string) => {
    setDiplomaFilter(value);
    setPage(1);
  };

  const handleImmutableFilterChange = (value: string) => {
    setImmutableFilter(value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setDiplomaFilter("all");
    setImmutableFilter("all");
    setPage(1);
  };

  const handleApplyFilters = () => {
    setPage(1);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#f4f5f7] font-mono text-[13px]">
      {/* breadcrumb header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-100 bg-white px-4 py-2 font-mono text-[12px] text-gray-400 sm:px-12">
        <span className="text-xs text-blue-500">Exams</span>
      </div>

      <AdminExamPaginationBar
        page={safePage}
        pageCount={pageCount}
        total={total}
        rangeFrom={rangeFrom}
        rangeTo={rangeTo}
        onPageChange={handlePageChange}
      />

      <div className="flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-6">
        <AdminExamFiltersPanel
          search={search}
          diplomaFilter={diplomaFilter}
          immutableFilter={immutableFilter}
          filtersOpen={filtersOpen}
          diplomaOptions={diplomaOptions}
          onSearchChange={handleSearchChange}
          onDiplomaFilterChange={handleDiplomaFilterChange}
          onImmutableFilterChange={handleImmutableFilterChange}
          onToggleFilters={() => setFiltersOpen((open) => !open)}
          onClearFilters={handleClearFilters}
          onApplyFilters={handleApplyFilters}
        />

        <AdminExamTable
          exams={exams}
          pageItems={pageItems}
          isLoading={isLoading}
          isError={isError}
          sort={sort}
          onSortChange={setSort}
        />
      </div>
    </div>
  );
}
