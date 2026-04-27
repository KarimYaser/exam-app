"use client";

import { useState } from "react";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmDeleteModal from "@/components/shared/confirm-delete-modal";

type QuestionListItem = {
  id: string;
  text: string;
};

type AdminQuestionCardProps = {
  examId: string;
  question: QuestionListItem;
  examTitle?: string;
  showExamColumn?: boolean;
  isDeleting?: boolean;
  onDelete: (questionId: string) => void;
};

export default function AdminQuestionCard({
  examId,
  question,
  examTitle,
  showExamColumn = false,
  isDeleting = false,
  onDelete,
}: AdminQuestionCardProps) {
  const router = useRouter();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const openDetails = () => {
    router.push(`/exams/${examId}/questions/${question.id}`);
  };

  const openEdit = () => {
    router.push(`/exams/${examId}/questions/${question.id}/edit`);
  };

  return (
    <>
      <div
        key={question.id}
        onClick={openDetails}
        className={`grid items-center gap-3 border-b border-gray-100 px-3 py-3 text-sm last:border-b-0 sm:px-4 cursor-pointer ${
          showExamColumn
            ? "grid-cols-[1fr_40px] sm:grid-cols-[1fr_220px_40px]"
            : "grid-cols-[1fr_40px]"
        }`}
      >
        <div className="min-w-0">
          <p
            className="truncate text-gray-800 hover:underline sm:font-normal font-medium"
            title={question.text}
          >
            {question.text}
          </p>
          {showExamColumn && (
            <p
              className="truncate text-gray-500 text-xs mt-0.5 sm:hidden"
              title={examTitle || ""}
            >
              {examTitle}
            </p>
          )}
        </div>

        {showExamColumn ? (
          <p
            className="truncate text-gray-500 hidden sm:block"
            title={examTitle || ""}
          >
            {examTitle}
          </p>
        ) : null}

        <div
          className="flex justify-end"
          onClick={(event) =>
            event.stopPropagation()
          } /*click event won't bubble up to parent elements */
          onKeyDown={(event) =>
            event.stopPropagation()
          } /*key down event won't bubble up to parent elements */
        >
          <DropdownMenu>
            <DropdownMenuTrigger className="text-gray-500 bg-gray-200 p-1.5 hover:text-gray-800 cursor-pointer">
              <MoreHorizontal className=" h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white font-sans text-sm *:hover:bg-gray-100"
            >
              <DropdownMenuItem onClick={openDetails}>
                <Eye className="h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openEdit}>
                <Pencil className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isDeleting}
                className="text-red-600 focus:bg-red-50 focus:text-red-600"
                onClick={() => setConfirmDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ConfirmDeleteModal
        open={confirmDeleteOpen}
        title="Delete this question?"
        description="This action is permanent and cannot be undone."
        deleteLabel="Delete"
        isPending={isDeleting}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={() => onDelete(question.id)}
      />
    </>
  );
}
