"use server";

import { getNextAuthToken } from "@/lib/util/auth.util";
import { revalidatePath } from "next/cache";

export interface BulkAnswerInput {
  text: string;
  isCorrect: boolean;
}

export interface BulkQuestionInput {
  text: string;
  answers: BulkAnswerInput[];
}

export interface BulkCreateQuestionsInput {
  questions: BulkQuestionInput[];
}

export interface BulkCreateQuestionsResponse {
  status?: boolean;
  code?: number;
  message: string;
  questions?: {
    id: string;
    text: string;
    examId: string;
    answers: { id: string; text: string }[];
  }[];
  count?: number;
}

export async function bulkCreateQuestions(
  examId: string,
  input: BulkCreateQuestionsInput,
): Promise<BulkCreateQuestionsResponse> {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${baseUrl}/questions/exam/${examId}/bulk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  const payload = (await response.json()) as BulkCreateQuestionsResponse;

  if (!response.ok) {
    throw new Error(payload?.message || "Failed to bulk create questions");
  }

  revalidatePath(`/exams/${examId}`);
  return payload;
}
