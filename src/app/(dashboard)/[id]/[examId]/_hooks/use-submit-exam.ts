import { useMutation, useQuery } from "@tanstack/react-query";
import {
  submitExamAnswers,
  getSubmissionDetails,
} from "@/app/(dashboard)/(admin)/exams/[id]/questions/_actions/questions.actions";

/**
 * Mutation hook for submitting exam answers
 * Handles the POST request to /api/submissions
 */
export function useSubmitExam() {
  return useMutation({
    mutationFn: async ({
      examId,
      answers,
      startedAt,
    }: {
      examId: string;
      answers: Record<string, string | null>;
      startedAt: string;
    }) => {
      // Call server action to submit answers
      const response = await submitExamAnswers(examId, answers, startedAt);
      // console.log("Exam submitted successfully:", response);
      return response; // Returns { id, examId, userId, score, etc. }
    },
    onError: (error) => {
      console.error("Submission failed:", error);
    },
  });
}

/**
 * Query hook for fetching submission details with analytics
 * Includes questions review and answer details
 */
export const SUBMISSION_KEYS = {
  all: ["submissions"] as const,
  detail: (submissionId: string) =>
    [...SUBMISSION_KEYS.all, "detail", submissionId] as const,
};

export function useSubmissionDetails(submissionId: string | null) {
  return useQuery({
    queryKey: SUBMISSION_KEYS.detail(submissionId || ""),
    queryFn: async () => {
      if (!submissionId) {
        throw new Error("Submission ID is required");
      }
      const response = await getSubmissionDetails(submissionId);
      return response;
    },
    enabled: !!submissionId, // Only fetch if submissionId exists
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
