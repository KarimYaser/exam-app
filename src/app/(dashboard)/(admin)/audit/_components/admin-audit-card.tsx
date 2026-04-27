import { MoreHorizontal, ExternalLink, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AuditLog } from "../_actions/audit.actions";

import { useRouter } from "next/navigation";

type AdminAuditCardProps = {
  log: AuditLog;
  onDelete: (id: string) => void;
  isSuperAdminUser: boolean;
};

export default function AdminAuditCard({
  log,
  onDelete,
  isSuperAdminUser,
}: AdminAuditCardProps) {
  const router = useRouter();
  const date = new Date(log.createdAt);

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const dateStr = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case "CREATE":
        return "text-[#00BC7D]"; // Green
      case "UPDATE":
        return "text-[#F59E0B]"; // Amber/Yellow
      case "DELETE":
        return "text-[#EF4444]"; // Red
      default:
        return "text-blue-600";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toUpperCase()) {
      case "OWNER":
      case "SUPER_ADMIN":
        return "text-red-500";
      case "ADMIN":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div
      onClick={() => router.push(`/audit/${log.id}`)}
      className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-[1fr_1.5fr_1.5fr_1.2fr_40px] sm:gap-4 sm:px-6 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 cursor-pointer"
    >
      {/* Action Column */}
      <div className="flex flex-col justify-center">
        <span
          className={`text-sm font-bold uppercase ${getActionColor(log.action)}`}
        >
          {log.action}
        </span>
        <span className="text-[11px] text-gray-400">
          Method: <span className="uppercase">{log.httpMethod}</span>
        </span>
      </div>

      {/* User Column */}
      <div className="flex flex-col justify-center min-w-0">
        <span className="text-sm font-bold text-gray-800 truncate">
          {log.actorUsername}
        </span>
        <span className="text-xs text-gray-500 truncate">{log.actorEmail}</span>
        <span
          className={`text-[11px] font-bold uppercase mt-0.5 ${getRoleColor(log.actorRole)}`}
        >
          {log.actorRole === "OWNER" || log.actorRole === "SUPER_ADMIN"
            ? "Super Admin"
            : log.actorRole}
        </span>
      </div>

      {/* Entity Column */}
      <div className="flex flex-col justify-center min-w-0">
        <span className="text-sm font-bold text-gray-800 capitalize">
          {log.entityType}
        </span>
        <div className="flex items-center gap-1 group">
          <span className="text-xs text-gray-400 truncate">{log.entityId}</span>
          <ExternalLink className="h-3 w-3 text-gray-300 group-hover:text-blue-400 transition-colors" />
        </div>
      </div>

      {/* Time Column */}
      <div className="flex flex-col justify-center">
        <span className="text-sm text-gray-700">{timeStr}</span>
        <span className="text-xs text-gray-400">{dateStr}</span>
      </div>

      {/* Actions Dropdown */}
      <div className="flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            className="text-gray-500 bg-gray-200 p-1.5 hover:text-gray-800 cursor-pointer"
          >
            <MoreHorizontal className="h-4 w-4 text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32 font-mono">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push(`/audit/${log.id}`)}
            >
              <Eye className="mr-2 h-4 w-4 text-emerald-600 " />
              View
            </DropdownMenuItem>
            {isSuperAdminUser && (
              <DropdownMenuItem
                onClick={() => onDelete(log.id)}
                className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
