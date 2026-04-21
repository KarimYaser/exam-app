"use server";

import { getNextAuthToken } from "@/lib/util/auth.util";
import { revalidatePath } from "next/cache";
import { AdminExamsResponse } from "../_types/admin-exam";

export interface DeleteExamResponse {
  status: boolean;
  code: number;
  message: string;
}

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

export async function deleteExamById(
  examId: string,
): Promise<DeleteExamResponse> {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${baseUrl}/exams/${examId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = (await response.json()) as DeleteExamResponse;

    revalidatePath("/exams");
    return payload;
  } catch (error) {
    throw error;
  }
}
