"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  deleteQuestionById,
  type QuestionPayload,
} from "@/app/(dashboard)/[id]/[examId]/_actions/questions.actions";
import { toast } from "sonner";

type QuestionDetailsProps = {
  examId: string;
  examTitle: string;
  question: QuestionPayload;
};

export default function QuestionDetails({
  examId,
  examTitle,
  question,
}: QuestionDetailsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { mutate: removeQuestion, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteQuestionById(question.id, examId),
    onSuccess: (response) => {
      toast.success(response?.message || "Question deleted successfully", {
        position: "top-right",
      });
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
        <span className="cursor-pointer text-gray-500 hover:underline" onClick={() => router.push("/exams")}>Exams</span>
        <span className="text-gray-300">/</span>
        <span className="cursor-pointer text-gray-500 hover:underline" onClick={() => router.push(`/exams/${examId}`)}>{examTitle}</span>
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
            onClick={() => router.push(`/exams/${examId}/questions/${question.id}/edit`)}
          >
            <Pencil className="h-4 w-4" />
            Edit Question
          </Button>

          {!confirmDelete ? (
            <Button
              type="button"
              variant="destructive"
              className="rounded-none bg-red-500 text-white"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete Question
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="destructive"
                className="rounded-none bg-red-500/50 text-white hover:bg-red-600"
                disabled={isDeleting}
                onClick={() => removeQuestion()}
              >
                {isDeleting ? "Deleting..." : "Are you sure? Delete"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="rounded-none bg-gray-200 text-gray-700 hover:bg-gray-300"
                disabled={isDeleting}
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="px-4 py-4 sm:px-6">
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="mb-1 text-xs font-medium text-gray-400">Question</div>
          <p className="mb-4 text-base font-semibold text-gray-800">{question.text}</p>

          <div className="mb-1 text-xs font-medium text-gray-400">Answers</div>
          <div className="space-y-2">
            {question.answers.map((answer, index) => (
              <div
                key={answer.id}
                className="rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
              >
                <span className="font-semibold text-gray-500">{index + 1}.</span>{" "}
                {answer.text}
                {answer.isCorrect ? (
                  <span className="ml-2 rounded bg-green-100 px-1.5 py-0.5 text-xs font-semibold text-green-700">
                    Correct
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
