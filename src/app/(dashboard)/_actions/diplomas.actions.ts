"use server";

import { getNextAuthToken } from "@/lib/util/auth.util";
import { revalidateTag } from "next/cache";

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

export interface CreateDiplomaInput {
  title: string;
  description: string;
  image: string;
}

export interface CreateDiplomaResponse {
  status: boolean;
  code: number;
  message: string;
  payload: {
    diploma: Diploma;
  };
}

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

export async function createDiploma(
  values: CreateDiplomaInput,
): Promise<CreateDiplomaResponse> {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${baseUrl}/diplomas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    const payload = (await response.json()) as CreateDiplomaResponse;

    if (!response.ok) {
      throw new Error(payload?.message || "Failed to create diploma");
    }

    revalidateTag("diplomas");
    return payload;
  } catch (error) {
    throw error;
  }
}
// console.log(getDiplomas());
