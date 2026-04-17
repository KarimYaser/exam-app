"use server";

import { getNextAuthToken } from "@/lib/util/auth.util";

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

/**
 * Fetches the paginated list of diplomas from the API.
 *
 * @param page The page number to fetch (default: 1)
 * @param limit The number of items per page (default: 20)
 * @returns A promise resolving to the DiplomasResponse object containing data and pagination info.
 */
export async function getDiplomas(
  page: number = 1,
  limit: number = 20,
): Promise<DiplomasResponse> {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const url = new URL(`${baseUrl}/diplomas`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "force-cache",
      next: { tags: ["diplomas"] },
    });
    const payload: DiplomasResponse = await response.json();
    // console.log(payload);
    return payload;
  } catch (error) {
    // console.log("Failed to fetch diplomas:", error);
    throw error;
  }
}
// console.log(getDiplomas());
