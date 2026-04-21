"use server";

import { revalidatePath } from "next/cache";
import { getNextAuthToken } from "@/lib/util/auth.util";

export interface CreateExamInput {
  title: string;
  description: string;
  image: string;
  duration: number;
  diplomaId: string;
}

export interface CreateExamResponse {
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

export async function createExam(
  values: CreateExamInput,
): Promise<CreateExamResponse> {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${baseUrl}/exams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    const payload:CreateExamResponse = await response.json();

    
    revalidatePath("/exams");
    return payload;
  } catch (error) {
    throw error;
  }
}
