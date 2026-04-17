"use server";

import { getNextAuthToken } from "@/lib/util/auth.util";
import {
  ExamResultsListResponse,
  ExamResultDetailsResponse,
} from "../_types/examResult";

export async function getExamResults(
  diplomaId: string,
  page: number = 1,
  limit: number = 20
): Promise<ExamResultsListResponse> {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(
      `${baseUrl}/exam-results?diplomaId=${diplomaId}&page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch exam results for diploma ${diplomaId}: ${response.status}`
      );
      return { status: false, code: response.status, payload: { data: [] } };
    }

    const payload: ExamResultsListResponse = await response.json();
    console.log("Exam results payload:", payload);

    return payload;
  } catch (error) {
    console.error("Error fetching exam results:", error);
    throw error;
  }
}

export async function getExamResultDetails(
  resultId: string
): Promise<ExamResultDetailsResponse> {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${baseUrl}/exam-results/${resultId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch exam result details for ${resultId}: ${response.status}`
      );
      throw new Error(
        `Failed to fetch exam result details: ${response.status}`
      );
    }

    const payload: ExamResultDetailsResponse = await response.json();
    console.log("Exam result details:", payload);

    return payload;
  } catch (error) {
    console.error("Error fetching exam result details:", error);
    throw error;
  }
}

export async function getExamResultsByExamId(
  examId: string,
  page: number = 1,
  limit: number = 20
): Promise<ExamResultsListResponse> {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(
      `${baseUrl}/exam-results?examId=${examId}&page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch exam results for exam ${examId}: ${response.status}`
      );
      return { status: false, code: response.status, payload: { data: [] } };
    }

    const payload: ExamResultsListResponse = await response.json();
    console.log("Exam results by exam ID:", payload);

    return payload;
  } catch (error) {
    console.error("Error fetching exam results by exam ID:", error);
    throw error;
  }
}
