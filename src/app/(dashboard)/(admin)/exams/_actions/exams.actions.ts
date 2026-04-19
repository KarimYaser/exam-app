"use server";

import { getNextAuthToken } from "@/lib/util/auth.util";
import { AdminExamsResponse } from "../_types/admin-exam";

export async function getAdminExams(
  page: number = 1,
  limit: number = 100,
): Promise<AdminExamsResponse> {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${baseUrl}/exams?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const payload: AdminExamsResponse = await response.json();
// console.log("getAdminExams payload", payload);
    

    return payload;
  } catch (error) {
    throw error;
  }
}
