import { PAGINATION_LIMIT } from "@/lib/constants/api.constant";
import { getNextAuthToken } from "@/lib/util/auth.util";
import isAdmin from "@/lib/util/is-admin";
import { NextRequest, userAgent } from "next/server";

export interface Diploma {
  id: string;
  title: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DiplomasPayload {
  data: Diploma[];
  pagination: Pagination;
}

export interface DiplomasResponse {
  payload: DiplomasPayload;
}

export async function getDiplomas(req: NextRequest): Promise<DiplomasResponse> {
  const { device } = userAgent(req);
  const viewport = device.type || "desktop";
  const isAdminUser = await isAdmin();
 
  const limit = viewport === "desktop" ? 12 : 3;
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const page = req.nextUrl.searchParams.get("page") || 1;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/diplomas?page=${page}&limit=${isAdminUser? 100 : limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch diplomas");
  }
  return response.json();
}
