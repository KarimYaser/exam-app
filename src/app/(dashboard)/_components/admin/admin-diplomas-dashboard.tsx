"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Diploma } from "../../_actions/diplomas.actions";
import useAdminDiplomasList from "../../_hooks/use-admin-diplomas-list";
import AdminDiplomaPaginationBar from "./admin-diploma-pagination-bar";
import AdminDiplomaFiltersPanel from "./admin-diploma-filters-panel";
import AdminDiplomaTable from "./admin-diploma-table";
import { SortKey } from "./admin-diploma-table-header";

const ADMIN_DIPLOMAS_PAGE_SIZE = 12;

type AdminDiplomaItem = {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: string;
  createdAt: string;
};

function applySort(items: AdminDiplomaItem[], sort: SortKey): AdminDiplomaItem[] {
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

function mapDiplomaToAdminItem(diploma: Diploma): AdminDiplomaItem {
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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategory("all");
    setPage(1);
  };

  const handleApplyFilters = () => {
    setPage(1);
  };

  const handleSortChange = (newSort: SortKey) => {
    setSort(newSort);
    setPage(1);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#f4f5f7] font-mono text-[13px]">
      {/* breadcrumb header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-100 bg-white px-4 py-2 font-mono text-[12px] text-gray-400 sm:px-12">
        <span
          className="cursor-pointer text-xs text-blue-500 hover:underline"
          onClick={() => router.push("/")}
        >
          Diplomas
        </span>
      </div>

      <AdminDiplomaPaginationBar
        page={safePage}
        pageCount={pageCount}
        total={total}
        rangeFrom={rangeFrom}
        rangeTo={rangeTo}
        onPageChange={handlePageChange}
      />

      <div className="flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-6">
        <AdminDiplomaFiltersPanel
          search={search}
          category={category}
          filtersOpen={filtersOpen}
          categories={categories}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onToggleFilters={() => setFiltersOpen((o) => !o)}
          onClearFilters={handleClearFilters}
          onApplyFilters={handleApplyFilters}
        />

        <AdminDiplomaTable
          pageItems={pageItems}
          isLoading={isLoading}
          isError={isError}
          sort={sort}
          onSortChange={handleSortChange}
        />
      </div>
    </div>
  );
}
