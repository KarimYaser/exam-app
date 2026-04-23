"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eraser,
  ArrowDownAZ,
  ArrowUpAZ,
  ArrowDown,
  ArrowUp,
  ChevronsDownUp,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import useAdminAuditLogs from "../_hooks/use-admin-audit-logs";
import AdminAuditCard from "./admin-audit-card";
import ConfirmDeleteModal from "@/components/shared/confirm-delete-modal";

const PAGE_SIZE = 20;

type SortKey =
  | "actorUsername-asc"
  | "actorUsername-desc"
  | "entityType-asc"
  | "entityType-desc"
  | "newest"
  | "oldest";

export default function AdminAuditDashboard({
  isSuperAdminUser,
}: {
  isSuperAdminUser: boolean;
}) {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(true);
  const [showClearModal, setShowClearModal] = useState(false);

  // Filter states
  const [category, setCategory] = useState<string>("all");
  const [action, setAction] = useState<string>("all");
  const [actorRole, setActorRole] = useState<string>("all");

  // Sort states
  const [sort, setSort] = useState<SortKey>("newest");

  const sortBy = useMemo(() => {
    if (sort === "newest" || sort === "oldest") return "createdAt";
    return sort.split("-")[0];
  }, [sort]);

  const sortOrder = useMemo(() => {
    if (sort === "newest") return "desc";
    if (sort === "oldest") return "asc";
    return sort.split("-")[1];
  }, [sort]);

  const isRoleFiltered = actorRole && actorRole !== "all";
  const isAlphabeticalSort = sort.startsWith("actorUsername");
  const isClientPagingNeeded = isRoleFiltered || isAlphabeticalSort;

  const { data, isLoading, isError, clearLogs, isClearing, deleteLog } =
    useAdminAuditLogs({
      page: isClientPagingNeeded ? 1 : page,
      limit: isClientPagingNeeded ? 100 : PAGE_SIZE,
      category,
      action,
      // Only send 'createdAt' to the backend to avoid 500 errors on unsupported fields
      sortBy: sortBy === "createdAt" ? "createdAt" : undefined,
      sortOrder,
    });
  // Client-side role filter & sort — ensures consistency across all fields
  const filteredLogs = useMemo(() => {
    let all = data?.payload?.data ?? [];
    // console.log(all);

    // 1. Filter by role
    if (isRoleFiltered) {
      all = all.filter(
        (log) => log.actorRole.toUpperCase() === actorRole.toUpperCase(),
      );
    }

    // 2. Apply sorting
    return [...all].sort((a, b) => {
      const valA = (a[sortBy as keyof typeof a] || "").toString().toLowerCase();
      const valB = (b[sortBy as keyof typeof b] || "").toString().toLowerCase();

      if (sortOrder === "asc") {
        return valA.localeCompare(valB);
      } else {
        return valB.localeCompare(valA);
      }
    });
  }, [data, actorRole, isRoleFiltered, sortBy, sortOrder]);

  // When client-paging needed: paginate client-side; otherwise API already paginates
  const logs = useMemo(() => {
    if (!isClientPagingNeeded) return filteredLogs;
    const start = (page - 1) * PAGE_SIZE;
    return filteredLogs.slice(start, start + PAGE_SIZE);
  }, [filteredLogs, isClientPagingNeeded, page]);

  const metadata = data?.payload?.metadata;
  const serverTotal = metadata?.total ?? 0;
  const filteredTotal = isClientPagingNeeded
    ? filteredLogs.length
    : serverTotal;
  const total = filteredTotal;
  const pageCount = Math.max(1, Math.ceil(filteredTotal / PAGE_SIZE));

  const rangeFrom = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeTo = Math.min(page * PAGE_SIZE, total);

  const categories = ["DIPLOMA", "EXAM", "QUESTION", "USER"];
  const actions = ["CREATE", "UPDATE", "DELETE"];
  const roles = [
    { value: "USER", label: "User" },
    { value: "ADMIN", label: "Admin" },
    { value: "SUPER_ADMIN", label: "Super Admin" },
  ];

  const handleClearFilters = () => {
    setCategory("all");
    setAction("all");
    setActorRole("all");
    setPage(1);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#f4f5f7] font-mono text-[13px]">
      {/* breadcrumb header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-100 bg-white px-4 py-2 font-mono text-[12px] text-gray-400 sm:px-12">
        <span className="text-xs text-gray-500">Audit Log</span>
      </div>

      {/* Top Pagination & Action Bar */}
      <div className="px-4 py-3 flex flex-col gap-3 sm:flex-row bg-white sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 ">
          <span className="text-xs text-gray-500 font-bold px-3 py-2 ">
            {total === 0
              ? "0 results"
              : `${rangeFrom} - ${rangeTo} of ${total}`}
          </span>
          <div className="flex items-center  text-gray-400 border-t border-b border-gray-100">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`h-8 w-8 bg-gray-200 hover:bg-gray-300 border-0 rounded-none cursor-pointer ${page <= 1 || isLoading ? "opacity-50" : "*:text-gray-600"}`}
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
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
              className={`h-8 w-8 bg-gray-200 hover:bg-gray-300 border-0 rounded-none cursor-pointer ${page >= pageCount || isLoading ? "opacity-50" : "*:text-gray-600"}`}
              disabled={page >= pageCount || isLoading}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {isSuperAdminUser && (
          <Button
            type="button"
            variant="destructive"
            className="bg-red-500 hover:bg-red-600 text-white h-10 max-w-36 px-1 rounded-none text-xs flex items-center gap-2 transition-all disabled:opacity-50"
            onClick={() => setShowClearModal(true)}
            disabled={isClearing || total === 0}
          >
            <Eraser className="h-4 w-4" />
            Clear All Logs
          </Button>
        )}
      </div>
      <div className="flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-6">
        {/* Search & Filters */}
        <div className="mb-4 shrink-0 border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="flex w-full items-center justify-between bg-blue-600 px-4 py-2.5 text-left text-sm font-bold text-white">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} />
              <span>Search & Filters</span>
            </div>
            <div
              className="flex items-center gap-1 text-[11px] uppercase cursor-pointer text-white "
              onClick={() => setFiltersOpen((o) => !o)}
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
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setPage(1);
                    }}
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
                    onChange={(e) => {
                      setAction(e.target.value);
                      setPage(1);
                    }}
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
                    onChange={(e) => {
                      setActorRole(e.target.value);
                      setPage(1);
                    }}
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
                  onClick={handleClearFilters}
                >
                  Clear
                </Button>
                <Button
                  className="bg-gray-200 text-gray-800 hover:bg-gray-300 font-bold px-6 rounded-none"
                  onClick={() => setPage(1)}
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Table structure */}
        <div className="flex flex-col rounded border border-gray-200 bg-white shadow-sm sm:min-h-0 sm:flex-1 sm:overflow-hidden">
          {/* Table Header */}
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
                    onClick={() => setSort("newest")}
                    className={
                      sort === "newest"
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : ""
                    }
                  >
                    <ArrowDown className="mr-2 h-4 w-4" /> Newest (desc)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSort("oldest")}
                    className={cn(
                      sort === "oldest" && "bg-blue-50 text-blue-700 font-bold",
                    )}
                  >
                    <ArrowUp className="mr-2 h-4 w-4" /> Oldest (asc)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSort("actorUsername-asc")}
                    className={cn(
                      sort === "actorUsername-asc" &&
                        "bg-blue-50 text-blue-700 font-bold",
                    )}
                  >
                    <ArrowDownAZ className="mr-2 h-4 w-4" /> User (A-Z)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSort("actorUsername-desc")}
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

          {/* Table Body */}
          <div className="divide-y divide-gray-100 sm:min-h-0 sm:flex-1 sm:overflow-y-auto overflow-x-hidden">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-500 font-bold animate-pulse">
                  Loading audit logs...
                </p>
              </div>
            ) : isError ? (
              <div className="px-4 py-16 text-center">
                <p className="text-sm text-red-500 font-bold">
                  Failed to load audit logs.
                </p>
                <Button
                  variant="link"
                  onClick={() => router.refresh()}
                  className="mt-2 text-blue-600"
                >
                  Try again
                </Button>
              </div>
            ) : logs.length === 0 ? (
              <div className="px-4 py-20 text-center flex flex-col items-center gap-2">
                <Eraser size={40} className="text-gray-200" />
                <p className="text-sm text-gray-500 font-bold">
                  No audit logs found for these filters.
                </p>
              </div>
            ) : (
              logs.map((log) => (
                <AdminAuditCard
                  key={log.id}
                  log={log}
                  onDelete={deleteLog}
                  isSuperAdminUser={isSuperAdminUser}
                />
              ))
            )}
          </div>
        </div>
      </div>
      <ConfirmDeleteModal
        open={showClearModal}
        onCancel={() => setShowClearModal(false)}
        onConfirm={async () => {
          await clearLogs();
          setShowClearModal(false);
        }}
        isPending={isClearing}
        title="Clear All Audit Logs"
        description="Are you sure you want to permanently delete ALL audit logs? This action cannot be undone."
        deleteLabel="Clear All"
      />
    </div>
  );
}
