"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ConfirmDeleteModal from "@/components/shared/confirm-delete-modal";
import useAdminAuditLogs from "../_hooks/use-admin-audit-logs";
import AdminAuditPaginationBar from "./admin-audit-pagination-bar";
import AdminAuditFiltersPanel from "./admin-audit-filters-panel";
import Table from "./admin-audit-table";
import type { SortKey } from "./admin-audit-table-header";
import AdminAuditBreadcrumbHeader from "./admin-audit-breadcrumb-header";

const PAGE_SIZE = 20;

export default function AdminAuditDashboard({
  isSuperAdminUser,
}: {
  isSuperAdminUser: boolean;
}) {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(true);
  const [showClearModal, setShowClearModal] = useState(false);
  const [deleteLogId, setDeleteLogId] = useState<string | null>(null);

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

  const { data, isLoading, isError, clearLogs, isClearing, deleteLog, isDeleting } =
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

  const handleClearFilters = () => {
    setCategory("all");
    setAction("all");
    setActorRole("all");
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleClearLogs = () => {
    setShowClearModal(true);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const handleActionChange = (value: string) => {
    setAction(value);
    setPage(1);
  };

  const handleActorRoleChange = (value: string) => {
    setActorRole(value);
    setPage(1);
  };

  const handleApplyFilters = () => {
    setPage(1);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#f4f5f7] font-mono text-[13px]">
      {/* breadcrumb header */}
      <AdminAuditBreadcrumbHeader/>

      <AdminAuditPaginationBar
        page={page}
        pageCount={pageCount}
        total={total}
        rangeFrom={rangeFrom}
        rangeTo={rangeTo}
        isLoading={isLoading}
        isSuperAdminUser={isSuperAdminUser}
        totalLogs={total}
        isClearing={isClearing}
        onPageChange={handlePageChange}
        onClearLogs={handleClearLogs}
      />

      <div className="flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-6">
        <AdminAuditFiltersPanel
          category={category}
          action={action}
          actorRole={actorRole}
          filtersOpen={filtersOpen}
          onCategoryChange={handleCategoryChange}
          onActionChange={handleActionChange}
          onActorRoleChange={handleActorRoleChange}
          onToggleFilters={() => setFiltersOpen((o) => !o)}
          onClearFilters={handleClearFilters}
          onApplyFilters={handleApplyFilters}
        />

        <Table
          logs={logs}
          isLoading={isLoading}
          isError={isError}
          router={router}
          isSuperAdminUser={isSuperAdminUser}
          sort={sort}
          onDelete={(id) => setDeleteLogId(id)}
          onSortChange={setSort}
        />
      </div>

      <ConfirmDeleteModal
        open={!!deleteLogId}
        onCancel={() => setDeleteLogId(null)}
        onConfirm={async () => {
          if (deleteLogId) {
            await deleteLog(deleteLogId);
            setDeleteLogId(null);
          }
        }}
        isPending={isDeleting}
        title="Delete Audit Log"
        description="Are you sure you want to delete this audit log entry? This action cannot be undone."
      />
      
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
