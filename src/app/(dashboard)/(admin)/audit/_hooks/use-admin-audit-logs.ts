"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAuditLogs,
  clearAllAuditLogs,
  deleteAuditLogById,
} from "../_actions/audit.actions";
import { toast } from "sonner";

export default function useAdminAuditLogs(params: {
  page?: number;
  limit?: number;
  category?: string;
  action?: string;
  actorUserId?: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => getAuditLogs(params),
  });

  const clearLogsMutation = useMutation({
    mutationFn: clearAllAuditLogs,
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message || "All audit logs cleared successfully");
        queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
      } else {
        toast.error(data.message || "Failed to clear audit logs");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  const deleteLogMutation = useMutation({
    mutationFn: (id: string) => deleteAuditLogById(id),
    onSuccess: (data) => {
      if (data.status) {
        toast.success(data.message || "Audit log entry deleted");
        queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
      } else {
        toast.error(data.message || "Failed to delete audit log");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  return {
    ...query,
    clearLogs: clearLogsMutation.mutate,
    isClearing: clearLogsMutation.isPending,
    deleteLog: deleteLogMutation.mutate,
    isDeleting: deleteLogMutation.isPending,
  };
}
