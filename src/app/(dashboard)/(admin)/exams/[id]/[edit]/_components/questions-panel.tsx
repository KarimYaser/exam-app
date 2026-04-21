"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteQuestionById } from "@/app/(dashboard)/[id]/[examId]/_actions/questions.actions";
import { EditExamQuestionItem } from "../_types/edit-exam.types";
import AdminQuestionCard from "../../../_components/admin-question-card";

type QuestionsPanelProps = {
  examId: string;
  questions: EditExamQuestionItem[];
};

export default function QuestionsPanel({ examId, questions }: QuestionsPanelProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: deleteQuestion, isPending: isDeletingQuestion } = useMutation({
    mutationFn: (questionId: string) => deleteQuestionById(questionId, examId),
    onSuccess: (response) => {
      toast.success(response?.message || "Question deleted successfully", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-exams"] });
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to delete question", {
        position: "top-right",
      });
    },
  });

  return (
    <div className="rounded border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between bg-[#155DFC] px-3 py-2.5 text-xs font-medium text-white sm:px-4">
        <span className="text-sm font-semibold">Exam Questions</span>
        <button
          type="button"
          onClick={() => router.push(`/exams/${examId}/questions/new`)}
          className="inline-flex items-center gap-1 text-xs hover:underline"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Questions
        </button>
      </div>

      <div className="grid grid-cols-[1fr_40px] items-center gap-3 border-b border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium uppercase tracking-wide text-gray-600 sm:px-4">
        <span>Title</span>
        <span className="text-right"> </span>
      </div>

      <div>
        {questions.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-gray-500">
            No questions found for this exam.
          </p>
        ) : (
          questions.map((question) => (
            <AdminQuestionCard
              key={question.id}
              examId={examId}
              question={question}
              isDeleting={isDeletingQuestion}
              onDelete={deleteQuestion}
            />
          ))
        )}
      </div>
    </div>
  );
}
