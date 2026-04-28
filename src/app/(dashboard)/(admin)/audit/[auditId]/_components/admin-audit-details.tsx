"use client";
import React, { useState } from "react";
import { AuditLog, deleteAuditLogById } from "../../_actions/audit.actions";
import { Trash2, ExternalLink, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ConfirmDeleteModal from "@/components/shared/confirm-delete-modal";

interface AdminAuditDetailsProps {
  log: AuditLog;
  isSuperAdminUser: boolean;
}

export default function AdminAuditDetails({
  log,
  isSuperAdminUser,
}: AdminAuditDetailsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteAuditLogById(log.id),
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message || "Audit log entry deleted");
        queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
        router.push("/audit");
      } else {
        toast.error(data.message || "Failed to delete audit log");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  const date = new Date(log.createdAt);

  // Format: 7:50:00 PM | Sat, April 14, 2025
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const datePart = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case "CREATE":
        return "text-[#00BC7D]";
      case "UPDATE":
        return "text-[#F59E0B]";
      case "DELETE":
        return "text-[#EF4444]";
      default:
        return "text-blue-600";
    }
  };

  const updatedFields = log.metadata?.keys || null;
  // console.log(log);
  // console.log(log.metadata.keys);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#f4f5f7] font-mono text-[13px] text-gray-500">
      {/* Breadcrumb */}
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-100 bg-white px-4 py-2 font-mono text-[12px] text-gray-400 sm:px-12">
        <Link href="/audit" className="text-gray-400 hover:underline">
          Audit Log
        </Link>
        <span className="text-gray-300">/</span>
        <span className="capitalize text-[14px] text-blue-500 font-bold">
          {log.entityType} {log.action.toLowerCase()} By {log.actorUsername}
        </span>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 bg-white px-6 py-1.5 font-mono text-[12px] text-gray-400 sm:px-12">
        <div>
          <h1 className="text-lg font-bold text-black  capitalize">
            {log.entityType} {log.action.toLowerCase()} By {log.actorUsername}
          </h1>
          <div className="flex items-center gap-1">
            <span className="text-[14px] text-gray-400">Entity:</span>
            <span className="capitalize text-[14px] text-gray-400 underline">
              {log.entityType} [{log.entityId}]
            </span>
            <ExternalLink className="h-3 w-3 text-gray-400" />
          </div>
        </div>
        {isSuperAdminUser && (
          <Button
            variant="destructive"
            className="bg-red-600 text-white rounded-none h-9 px-5 gap-2 text-xs md:w-fit w-full"
            onClick={() => setShowDeleteModal(true)}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        )}
      </div>
      <div className="flex  flex-1 flex-col px-6 py-6 sm:px-12 sm:py-6">
        {/* Content Card */}
        <div className="bg-white border border-gray-100 shadow-sm p-4 space-y-4 max-h-[509px] overflow-y-auto">
          {/* Action */}
          <div className="space-y-0.5">
            <h3 className="text-gray-300 font-bold uppercase tracking-wider text-[14px]">
              Action
            </h3>
            <p
              className={`font-bold uppercase text-[14pxpx] ${getActionColor(
                log.action,
              )}`}
            >
              {log.action}
            </p>
          </div>

          {/* Method */}
          <div className="space-y-0.5">
            <h3 className="text-gray-300 font-bold uppercase tracking-wider text-[14px]">
              Method
            </h3>
            <p className="font-bold text-gray-800 uppercase text-[12px]">
              {log.httpMethod}
            </p>
          </div>

          {/* User */}
          <div className="space-y-0.5">
            <h3 className="text-gray-300 font-bold uppercase tracking-wider text-[14px]">
              User
            </h3>
            <div className="space-y-0">
              <p className="font-bold text-gray-800 text-[14px]">
                {log.actorUsername}
              </p>
              <p className="text-[14px] text-gray-400">
                Email:{" "}
                <span className="text-gray-500 text-[12px]">
                  {log.actorEmail}
                </span>
              </p>
              <p className="text-[12px] text-gray-400">
                IP Address:{" "}
                <span className="text-gray-500">{log.ipAddress}</span>
              </p>
              <p className="text-[12px] text-gray-400">
                Role:{" "}
                <span className="text-red-500">
                  {log.actorRole === "SUPER_ADMIN"
                    ? "Super Admin"
                    : log.actorRole}
                </span>
              </p>
            </div>
          </div>

          {/* Entity */}
          <div className="space-y-0.5">
            <h3 className="text-gray-300 font-bold uppercase tracking-wider text-[14px]">
              Entity
            </h3>
            <div className="flex items-center gap-1.5">
              <p className="text-gray-800 font-bold text-[14px] capitalize">
                {log.entityType}:
              </p>
              <p className="text-gray-800 font-bold text-[14px]">
                {log.entityId}
              </p>
              <ExternalLink className="h-3 w-3 text-gray-800" />
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-0.5">
            <h3 className="text-gray-300 font-bold uppercase tracking-wider text-[14px] font-mono">
              Date & Time
            </h3>
            <p className="font-bold text-gray-800 text-[12px] font-mono">
              {timePart}{" "}
              <span className="text-gray-300 font-normal mx-1">|</span>{" "}
              {datePart}
            </p>
          </div>

          {/* Updated Fields */}
          {log.action.toUpperCase() === "UPDATE" && (
            <div className="space-y-0.5">
              <h3 className="text-gray-300 font-bold uppercase tracking-wider text-[14px]">
                Updated Fields
              </h3>
              <p className="font-bold text-gray-800 text-[14px]">
                {updatedFields?.map(
                  (field: string, idx: number): React.ReactNode => (
                    <React.Fragment key={idx}>
                      <span> {field}</span>
                      <span> {idx !== updatedFields.length - 1 && ","}</span>
                    </React.Fragment>
                  ),
                )}
              </p>
            </div>
          )}

          {/* Metadata */}
          {log.action !== "DELETE" && (
            <div className="space-y-2">
              <h3 className="text-gray-300 font-bold uppercase tracking-wider text-[14px]">
                Metadata
              </h3>
              <div className="bg-[#E9EDF1] p-3 rounded-sm">
                <pre className="text-gray-700 font-mono text-[14px] whitespace-pre-wrap leading-relaxed">
                  {JSON.stringify(log.metadata, null, 2)
                    .replace(/^\{/, "")
                    .replace(/\}$/, "")
                    .trim()}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDeleteModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => deleteMutation.mutate()}
        isPending={deleteMutation.isPending}
        title="Delete Audit Log"
        description="Are you sure you want to delete this specific audit log entry? This action cannot be undone."
      />
    </div>
  );
}
