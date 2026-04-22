"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCheck, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  deleteQuestionById,
  type QuestionPayload,
} from "@/app/(dashboard)/(admin)/exams/[id]/questions/_actions/questions.actions";
import { toast } from "sonner";
import ConfirmDeleteModal from "@/components/shared/confirm-delete-modal";

type QuestionDetailsProps = {
  examId: string;
  examTitle: string;
  question: QuestionPayload;
};

type ExtendedAnswer = QuestionPayload["answers"][number] & {
  correct?: boolean;
};

type ExtendedQuestion = QuestionPayload & {
  correctAnswerId?: string;
  correctAnswer?: {
    id?: string;
  };
  answers: ExtendedAnswer[];
};

export default function QuestionDetails({
  examId,
  examTitle,
  question,
}: QuestionDetailsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const normalizedQuestion = question as ExtendedQuestion;
  const fallbackCorrectAnswerId =
    normalizedQuestion.correctAnswerId || normalizedQuestion.correctAnswer?.id;

  const { mutate: removeQuestion, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteQuestionById(question.id, examId),
    onSuccess: (response) => {
      toast.success(response?.message || "Question deleted successfully", {
        position: "top-right",
      });
      setConfirmDeleteOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-exams"] });
      router.push(`/exams/${examId}`);
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to delete question", {
        position: "top-right",
      });
    },
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#f4f5f7] font-mono text-[13px]">
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4 py-3 text-xs sm:px-6">
        <span
          className="cursor-pointer text-gray-500 hover:underline"
          onClick={() => router.push("/exams")}
        >
          Exams
        </span>
        <span className="text-gray-300">/</span>
        <span
          className="cursor-pointer text-gray-500 hover:underline"
          onClick={() => router.push(`/exams/${examId}`)}
        >
          {examTitle}
        </span>
        <span className="text-gray-300">/</span>
        <span className="font-semibold text-[#155DFC]">Question Details</span>
      </div>

      <div className="mb-4 flex flex-col gap-3 border-b border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
            Question Details
          </h1>
          <p className="text-sm text-gray-500">Exam: {examTitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            className="rounded-none bg-[#155DFC] text-white hover:bg-blue-700"
            onClick={() =>
              router.push(`/exams/${examId}/questions/${question.id}/edit`)
            }
          >
            <Pencil className="h-4 w-4" />
            Edit Question
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="rounded-none bg-red-500 text-white hover:bg-red-600"
            onClick={() => setConfirmDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete Question
          </Button>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-6">
        <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
          <div className="bg-[#155DFC] px-4 py-2.5 text-sm font-semibold text-white">
            Question Information
          </div>

          <div className="space-y-4 p-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Question
              </label>
              <div className="rounded border border-gray-200 bg-gray-50 px-3 py-3 text-base font-semibold text-gray-800">
                {question.text}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Answers
              </label>
              <div className="space-y-2">
                {normalizedQuestion.answers.map((answer, index) => {
                  const answerWithFallback = answer as ExtendedAnswer;
                  const isCorrect =
                    Boolean(answer.isCorrect) ||
                    Boolean(answerWithFallback.correct) ||
                    (fallbackCorrectAnswerId
                      ? answer.id === fallbackCorrectAnswerId
                      : false);
                  return (
                    <div
                      key={answer.id}
                      className={`flex items-center justify-between rounded border px-3 py-2 text-sm ${
                        isCorrect
                          ? "border-green-300 bg-green-50 text-green-900"
                          : "border-gray-200 bg-gray-50 text-gray-700"
                      }`}
                    >
                      <span>
                        <span className="mr-2 font-semibold text-gray-500">
                          {index + 1}.
                        </span>
                        {answer.text}
                      </span>
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                          <CheckCheck className="h-3.5 w-3.5" />
                          Correct Answer
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        open={confirmDeleteOpen}
        title="Delete this question?"
        description="This removes the question and its answers. This action cannot be undone."
        deleteLabel="Delete Question"
        isPending={isDeleting}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={() => removeQuestion()}
      />
    </div>
  );
}
