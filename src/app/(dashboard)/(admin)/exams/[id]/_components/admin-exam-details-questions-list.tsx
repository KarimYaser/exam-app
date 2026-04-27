"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownAZ,
  ArrowDownWideNarrow,
  ArrowUpAZ,
  CalendarArrowDown,
  CalendarArrowUp,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdminQuestionCard from "../../_components/admin-question-card";

export type SortKey = "title-asc" | "title-desc" | "newest-desc" | "newest-asc";

export type ExamQuestionItem = {
  id: string;
  text: string;
  createdAt: string;
};

interface AdminExamQuestionsListProps {
  examId: string;
  examTitle: string;
  questions: ExamQuestionItem[];
  isDeletingQuestion: boolean;
  onDeleteQuestion: (id: string) => void;
}

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

export default function AdminExamQuestionsList({
  examId,
  examTitle,
  questions,
  isDeletingQuestion,
  onDeleteQuestion,
}: AdminExamQuestionsListProps) {
  const router = useRouter();
  const [sort, setSort] = useState<SortKey>("title-desc");

  const sortedQuestions = useMemo(
    () => applyQuestionSort(questions, sort),
    [questions, sort],
  );

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

      <div className="flex justify-between items-center gap-3 border-b border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium uppercase tracking-wide text-gray-600 sm:px-4">
        <span>Title</span>
        <div className="">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 normal-case text-gray-600 hover:bg-gray-200">
              Sort
              <ArrowDownWideNarrow className="h-3.5 w-3.5" />
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
              examId={examId}
              examTitle={examTitle}
              question={question}
              showExamColumn={false}
              isDeleting={isDeletingQuestion}
              onDelete={onDeleteQuestion}
            />
          ))
        )}
      </div>
    </div>
  );
}
