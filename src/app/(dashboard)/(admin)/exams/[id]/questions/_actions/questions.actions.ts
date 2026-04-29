"use server";

import { getNextAuthToken } from "@/lib/util/auth.util";
import { revalidatePath } from "next/cache";
import {
  QuestionsListResponse,
  SubmitExamRequest,
  SubmissionDetailsResponse,
} from "@/app/(dashboard)/[id]/[examId]/_types/question";

export interface QuestionAnswerPayload {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface QuestionPayload {
  id: string;
  text: string;
  examId: string;
  answers: QuestionAnswerPayload[];
}

export interface QuestionDetailsResponse {
  status: boolean;
  code: number;
  message?: string;
  payload?: {
    question?: QuestionPayload;
  };
  question?: QuestionPayload;
}

export interface QuestionAnswerInput {
  text: string;
  isCorrect: boolean;
}

export interface CreateQuestionInput {
  text: string;
  examId: string;
  answers: QuestionAnswerInput[];
}

export interface UpdateQuestionInput {
  text: string;
  answers: QuestionAnswerInput[];
}

export interface CreateOrUpdateQuestionResponse {
  status: boolean;
  code: number;
  message: string;
  payload?: {
    question?: QuestionPayload;
  };
}

export interface DeleteQuestionResponse {
  status: boolean;
  code: number;
  message: string;
}

export async function getExamQuestions(
  examId: string,
): Promise<QuestionsListResponse> {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${baseUrl}/questions/exam/${examId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch questions for exam ${examId}: ${response.status}`,
      );
      return {
        status: false,
        code: response.status,
        payload: { data: [], exam: { id: "", title: "", duration: 0 } },
      };
    }

    const payload: QuestionsListResponse = await response.json();
    // console.log("Questions payload:", payload);

    return payload;
  } catch (error) {
    // console.error("Error fetching exam questions:", error);
    throw error;
  }
}

export async function getQuestionById(
  questionId: string,
): Promise<QuestionDetailsResponse> {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${baseUrl}/questions/${questionId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const payload: QuestionDetailsResponse = await response.json();

    return payload;
  } catch (error) {
    throw error;
  }
}

export async function createQuestion(
  values: CreateQuestionInput,
): Promise<CreateOrUpdateQuestionResponse> {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${baseUrl}/questions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const payload: CreateOrUpdateQuestionResponse = await response.json();

    if (!response.ok || !payload?.status) {
      throw new Error(payload?.message || "Failed to create question");
    }

    // revalidatePath(`/exams/${values.examId}`);
    return payload;
  } catch (error) {
    throw error;
  }
}

export async function updateQuestionById(
  questionId: string,
  values: UpdateQuestionInput,
): Promise<CreateOrUpdateQuestionResponse> {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${baseUrl}/questions/${questionId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const payload: CreateOrUpdateQuestionResponse = await response.json();

    return payload;
  } catch (error) {
    throw error;
  }
}

export async function deleteQuestionById(
  questionId: string,
  examId?: string,
): Promise<DeleteQuestionResponse> {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${baseUrl}/questions/${questionId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const payload: DeleteQuestionResponse = await response.json();

    if (examId) {
      revalidatePath(`/exams/${examId}`);
    }

    return payload;
  } catch (error) {
    throw error;
  }
}

export async function submitExamAnswers(
  examId: string,
  answers: Record<string, string | null>,
  startedAt: string,
): Promise<SubmissionDetailsResponse> {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    if (!token) {
      throw new Error(
        "Authentication token not available. Please log in again.",
      );
    }

    if (!baseUrl) {
      throw new Error("API URL not configured.");
    }
// entry is [questionId, answerId], filter out unanswered and convert to array of { questionId, answerId }
    const normalizedAnswers = Object.entries(answers)
      .filter((entry): entry is [string, string] => Boolean(entry[1]))
      .map(([questionId, answerId]) => ({
        questionId,
        answerId,
      }));

    const payload: SubmitExamRequest = {
      examId,
      answers: normalizedAnswers,
      startedAt,
    };

    // console.log("Submitting exam with payload:", {
    //   examId,
    //   answers: normalizedAnswers,
    //   startedAt,
    // });

    const response = await fetch(`${baseUrl}/submissions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json().catch(() => ({})); /* catch helps to handle JSON parse errors */
    // const responseData = await response.json();
// console.log(responseData);
    if (!response.ok) {
      const errorMessage =
        responseData?.message ||
        responseData?.error ||
        `HTTP ${response.status}`;
      // console.error("Failed to submit exam answers:", response.status, responseData);
      throw new Error(`Failed to submit exam: ${errorMessage}`);
    }

    const result: SubmissionDetailsResponse = responseData;
    // console.log("Submission result:", result);
    return result;
  } catch (error) {
    // console.error("Error submitting exam answers:", errorMessage);
    throw error;
  }
}

export async function getSubmissionDetails(
  submissionId: string,
): Promise<SubmissionDetailsResponse> {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const byIdResponse = await fetch(`${baseUrl}/submissions/${submissionId}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (byIdResponse.ok) {
      return (await byIdResponse.json()) as SubmissionDetailsResponse;
    }

    const fallbackResponse = await fetch(
      `${baseUrl}/submissions?submissionId=${submissionId}&page=1&limit=20`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      },
    );

    if (!fallbackResponse.ok) {
      throw new Error(
        `Failed to fetch submission details: ${fallbackResponse.status}`,
      );
    }

    return (await fallbackResponse.json()) as SubmissionDetailsResponse;
  } catch (error) {
    // console.error("Error fetching submission details:", error);
    throw error;
  }
}
