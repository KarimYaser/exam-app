"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  CalendarArrowDown,
  CalendarArrowUp,
  CircleOff,
  ExternalLink,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminExam } from "../../_types/admin-exam";
import { toast } from "sonner";
import { deleteQuestionById } from "@/app/(dashboard)/(admin)/exams/[id]/questions/_actions/questions.actions";
import AdminQuestionCard from "../../_components/admin-question-card";
import { deleteExamById } from "../../_actions/exams.actions";
import ConfirmDeleteModal from "@/components/shared/confirm-delete-modal";

type SortKey = "title-asc" | "title-desc" | "newest-desc" | "newest-asc";

type ExamQuestionItem = {
  id: string;
  text: string;
  createdAt: string;
};

type AdminExamDetailsProps = {
  exam: AdminExam;
  questions: ExamQuestionItem[];
};

function applyQuestionSort(
  questions: ExamQuestionItem[],
  sort: SortKey,
): ExamQuestionItem[] {
  const copy = [...questions];
  switch (sort) {
    case "title-asc":
      return copy.sort((a, b) => a.text.localeCompare(b.text));
    case "title-desc":
      return copy.sort((a, b) => b.text.localeCompare(a.text));
    case "newest-desc":
      return copy.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      );
    case "newest-asc":
      return copy.sort(
        (a, b) =>
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime(),
      );
    default:
      return copy;
  }
}

export default function AdminExamDetails({
  exam,
  questions,
}: AdminExamDetailsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sort, setSort] = useState<SortKey>("title-desc");
  const [confirmDeleteExamOpen, setConfirmDeleteExamOpen] = useState(false);

  const { mutate: deleteQuestion, isPending: isDeletingQuestion } = useMutation(
    {
      mutationFn: (questionId: string) =>
        deleteQuestionById(questionId, exam.id),
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
    },
  );

  const { mutate: deleteExam, isPending: isDeletingExam } = useMutation({
    mutationFn: () => deleteExamById(exam.id),
    onSuccess: (response) => {
      toast.success(response?.message || "Exam deleted successfully", {
        position: "top-right",
      });
      setConfirmDeleteExamOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-exams"] });
      router.push("/exams");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to delete exam", {
        position: "top-right",
      });
    },
  });

  const sortedQuestions = useMemo(
    () => applyQuestionSort(questions, sort),
    [questions, sort],
  );

  const questionsCount =
    exam._count?.questions ?? exam.questionsCount ?? questions.length;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f4f5f7] font-mono text-[13px] overflow-y-auto">
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4 py-3 text-xs sm:px-6">
        <span
          className="text-gray-500 hover:underline cursor-pointer"
          onClick={() => router.push("/exams")}
        >
          Exams
        </span>
        <span className="text-gray-300">/</span>
        <span className="font-semibold text-[#155DFC]">{exam.title}</span>
      </div>

      <div className="mb-4 flex flex-col gap-3 border-b border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
            {exam.title}
          </h1>
          <p className="text-sm text-gray-500">
            Diploma: {exam.diploma?.title || "Unknown Diploma"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded ${exam.immutable ? "bg-gray-100 text-gray-500" : "bg-yellow-500 text-white"} px-3 py-1.5 text-xs`}
          >
            {exam.immutable ? (
              <CircleOff className="h-3.5 w-3.5 text-red-500" />
            ) : (
              <Pencil className="h-3.5 w-3.5" />
            )}
            {exam.immutable ? "Immutable" : "Mutable"}
          </span>
          <button
            type="button"
            onClick={() => router.push(`/exams/${exam.id}/edit`)}
            className="inline-flex items-center gap-1 bg-[#155DFC] px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setConfirmDeleteExamOpen(true)}
            className="inline-flex items-center gap-1 bg-[#EF4444] px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>
      <div className="px-4 py-4 sm:px-6">
        <div className="mb-4 rounded border border-gray-200 bg-white p-3 sm:p-4">
          <div className="mb-1 text-xs font-medium text-gray-400">Image</div>
          <div className="relative mb-4 h-56 w-full max-w-55 overflow-hidden border border-gray-200 bg-gray-50 sm:h-60 sm:w-55">
            {exam.image ? (
              <Image
                unoptimized
                src={exam.image}
                alt={exam.title}
                fill
                className="object-cover"
                sizes="220px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-700 to-slate-900 text-4xl font-bold text-white">
                {exam.title
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
            )}
          </div>

          <div className="mb-1 text-xs font-medium text-gray-400">Title</div>
          <p className="mb-4 text-base font-semibold text-gray-800">
            {exam.title}
          </p>

          <div className="mb-1 text-xs font-medium text-gray-400">
            Description
          </div>
          <p className="mb-4 max-w-250 leading-7 text-gray-700">
            {exam.description}
          </p>

          <div className="mb-1 text-xs font-medium text-gray-400">Diploma</div>
          <p className="mb-4 inline-flex items-center gap-1.5 text-gray-700">
            {exam.diploma?.title || "Unknown Diploma"}
            <ExternalLink className="h-3.5 w-3.5" />
          </p>

          <div className="mb-1 text-xs font-medium text-gray-400">Duration</div>
          <p className="mb-4 text-gray-700">{exam.duration} Minutes</p>

          <div className="mb-1 text-xs font-medium text-gray-400">
            No. of Questions
          </div>
          <p className="text-gray-700">{questionsCount}</p>
        </div>

        <div className="rounded border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between bg-[#155DFC] px-3 py-2.5 text-xs font-medium text-white sm:px-4">
            <span className="text-sm font-semibold">Exam Questions</span>
            <button
              type="button"
              onClick={() => router.push(`/exams/${exam.id}/questions/new`)}
              className="inline-flex items-center gap-1 text-xs hover:underline"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Questions
            </button>
          </div>

          <div className="grid grid-cols-[1fr_220px_72px] items-center gap-3 border-b border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium uppercase tracking-wide text-gray-600 sm:px-4">
            <span>Title</span>
            <span>Exam</span>
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 normal-case text-gray-600 hover:bg-gray-200">
                  Sort
                  <ArrowDownAZ className="h-3.5 w-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="font-sans text-sm bg-white"
                >
                  <DropdownMenuItem onClick={() => setSort("title-desc")}>
                    <ArrowUpAZ className="h-4 w-4" />
                    Title (descending)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSort("title-asc")}>
                    <ArrowDownAZ className="h-4 w-4" />
                    Title (ascending)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSort("newest-desc")}>
                    <CalendarArrowDown className="h-4 w-4" />
                    Newest (descending)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSort("newest-asc")}>
                    <CalendarArrowUp className="h-4 w-4" />
                    Newest (ascending)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div>
            {sortedQuestions.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-gray-500">
                No questions found for this exam.
              </p>
            ) : (
              sortedQuestions.map((question) => (
                <AdminQuestionCard
                  key={question.id}
                  examId={exam.id}
                  examTitle={exam.title}
                  question={question}
                  showExamColumn
                  isDeleting={isDeletingQuestion}
                  onDelete={deleteQuestion}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        open={confirmDeleteExamOpen}
        title="Delete this exam?"
        description="This action is permanent and cannot be undone."
        deleteLabel="Delete"
        isPending={isDeletingExam}
        onCancel={() => setConfirmDeleteExamOpen(false)}
        onConfirm={() => deleteExam()}
      />
    </div>
  );
}
