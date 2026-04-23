"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ban, ExternalLink, PencilLine, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
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

export default function QuestionDetails({
  examId,
  examTitle,
  question,
}: QuestionDetailsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const { mutate: removeQuestion, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteQuestionById(question.id, examId),
    onSuccess: (response) => {
      toast.success(response?.message || "Question deleted successfully", {
        position: "top-right",
      });
      setConfirmDeleteOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-exams"] });
      router.push(`/exams/${examId}`);
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to delete question", {
        position: "top-right",
      });
    },
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#F9FAFB] text-[13px]">
      {/* Breadcrumbs */}
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-100 bg-white px-6 py-4 font-mono text-[12px] text-gray-400 sm:px-12">
        <span
          className="cursor-pointer hover:text-gray-500 hover:underline"
          onClick={() => router.push("/exams")}
        >
          Exams
        </span>
        <span>/</span>
        <span
          className="cursor-pointer hover:text-gray-500 hover:underline"
          onClick={() => router.push(`/exams/${examId}`)}
        >
          {examTitle}
        </span>
        <span>/</span>
        <span
          className="cursor-pointer hover:text-gray-500 hover:underline"
          onClick={() => router.push(`/exams/${examId}`)}
        >
          Questions
        </span>
        <span>/</span>
        <span className="text-[#155DFC]">{question.text}</span>
      </div>

      {/* Header */}
      <div className="flex shrink-0 flex-col items-start justify-between gap-4 border-b border-gray-100 bg-white px-6 py-6 sm:flex-row sm:items-center sm:px-12">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-[#101828]">
            {question.text}
          </h1>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <span>Exam:</span>
            <span
              className="cursor-pointer border-b border-gray-200 hover:text-gray-600"
              onClick={() => router.push(`/exams/${examId}`)}
            >
              {examTitle}
            </span>
            <ExternalLink className="h-3.5 w-3.5" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled
            className="flex items-center gap-2 bg-[#EDF0F2] px-2.5 py-1.5 text-sm font-medium text-[#4F5B67] opacity-80"
          >
            <Ban className="h-4 w-4" />
            Immutable
          </button>
          <button
            onClick={() =>
              router.push(`/exams/${examId}/questions/${question.id}/edit`)
            }
            className="flex items-center gap-2 bg-[#155DFC] px-2.5 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <PencilLine className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => setConfirmDeleteOpen(true)}
            className="flex items-center gap-2 bg-[#D92D20] px-2.5 py-1.5 text-sm font-medium text-white hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="px-2 py-2 sm:px-12 sm:py-6">
        <div className="bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="block font-mono text-[12px] uppercase tracking-wider text-[#9FA7B0]">
                Headline
              </label>
              <div className="font-mono text-sm leading-relaxed text-[#101828]">
                {question.text}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-mono text-[12px] uppercase tracking-wider text-[#9FA7B0]">
                Exam
              </label>
              <div className="flex items-center gap-1 font-mono text-sm text-[#101828]">
                {examTitle}
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-mono text-[12px] uppercase tracking-wider text-[#9FA7B0]">
                Answers
              </label>
              <div className="font-mono text-sm text-[#101828]">
                {question.answers.length}
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
