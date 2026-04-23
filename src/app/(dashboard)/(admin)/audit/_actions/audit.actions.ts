"use server";

import { getNextAuthToken } from "@/lib/util/auth.util";
import { revalidatePath, revalidateTag } from "next/cache";

export interface AuditLog {
  id: string;
  createdAt: string;
  actorUserId: string;
  actorUsername: string;
  actorEmail: string;
  actorRole: string;
  category: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  httpMethod: string;
  path: string;
}

export interface AuditLogsPayload {
  data: AuditLog[];
  metadata: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface AuditLogsResponse {
  status: boolean;
  code: number;
  payload: AuditLogsPayload;
}

export interface GenericResponse {
  status: boolean;
  code: number;
  message: string;
}

export async function getAuditLogs(params: {
  page?: number;
  limit?: number;
  category?: string;
  action?: string;
  actorUserId?: string;
  sortBy?: string;
  sortOrder?: string;
} = {}): Promise<AuditLogsResponse> {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const url = new URL(`${baseUrl}/admin/audit-logs`);
    if (params.page) url.searchParams.append("page", params.page.toString());
    if (params.limit) url.searchParams.append("limit", params.limit.toString());
    if (params.category && params.category !== "all") url.searchParams.append("category", params.category);
    if (params.action && params.action !== "all") url.searchParams.append("action", params.action);
    if (params.actorUserId) url.searchParams.append("actorUserId", params.actorUserId);
    if (params.sortBy) url.searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) url.searchParams.append("sortOrder", params.sortOrder);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { tags: ["audit-logs"] },
    });
    
    if (!response.ok) {
        throw new Error(`Failed to fetch audit logs: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function clearAllAuditLogs(): Promise<GenericResponse> {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${baseUrl}/admin/audit-logs`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = (await response.json()) as GenericResponse;
    revalidateTag("audit-logs");
    return payload;
  } catch (error) {
    throw error;
  }
}

export async function deleteAuditLogById(id: string): Promise<GenericResponse> {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${baseUrl}/admin/audit-logs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = (await response.json()) as GenericResponse;
    revalidateTag("audit-logs");
    return payload;
  } catch (error) {
    throw error;
  }
}
