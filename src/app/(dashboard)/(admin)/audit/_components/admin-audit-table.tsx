"use client";

import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";
import AdminAuditCard from "./admin-audit-card";
import type { AuditLog } from "../_actions/audit.actions";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { type SortKey } from "./admin-audit-table-header";
import AdminAuditTableHeader from "./admin-audit-table-header";
import AdminAuditCardSkeleton from "./admin-audit-card-skeleton";

interface TableProps {
  logs: AuditLog[];
  isLoading: boolean;
  isError: boolean;
  router: AppRouterInstance;
  isSuperAdminUser: boolean;
  sort: SortKey;
  onDelete: (id: string) => void;
  onSortChange: (sort: SortKey) => void;
}

export default function Table({
  logs,
  isLoading,
  isError,
  router,
  isSuperAdminUser,
  sort,
  onDelete,
  onSortChange,
}: TableProps) {
  return (
    <div className="flex flex-col rounded border border-gray-200 bg-white shadow-sm sm:min-h-0 sm:flex-1 sm:overflow-hidden">
      <AdminAuditTableHeader sort={sort} onSortChange={onSortChange} />

      <div className="divide-y divide-gray-100 sm:min-h-0 sm:flex-1 sm:overflow-y-auto overflow-x-hidden">
        {isLoading ? (
          <div className="flex flex-col w-full">
            {Array.from({ length: 5 }).map((_, i) => (
              <AdminAuditCardSkeleton key={i} />
            ))}
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
              onDelete={onDelete}
              isSuperAdminUser={isSuperAdminUser}
            />
          ))
        )}
      </div>
    </div>
  );
}
