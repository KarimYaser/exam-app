"use server";

import { revalidatePath } from "next/cache";
import { getNextAuthToken } from "@/lib/util/auth.util";

export interface UpdateExamInput {
  title: string;
  description: string;
  image: string;
  duration: number;
  diplomaId: string;
}

export interface UpdateExamResponse {
  status: boolean;
  code: number;
  message: string;
  payload: {
    exam: {
      id: string;
      title: string;
      description: string;
      image: string;
      duration: number;
      diplomaId: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export async function updateExamById(
  examId: string,
  values: UpdateExamInput,
): Promise<UpdateExamResponse> {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${baseUrl}/exams/${examId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    const payload = (await response.json()) as UpdateExamResponse;

    if (!response.ok) {
      throw new Error(payload?.message || "Failed to update exam");
    }

    revalidatePath("/exams");
    revalidatePath(`/exams/${examId}`);

    return payload;
  } catch (error) {
    throw error;
  }
}
