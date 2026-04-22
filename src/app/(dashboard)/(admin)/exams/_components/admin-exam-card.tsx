"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminExamCardItem } from "../_types/admin-exam";
import { deleteExamById } from "../_actions/exams.actions";
import { toast } from "sonner";
import ConfirmDeleteModal from "@/components/shared/confirm-delete-modal";

type AdminExamCardProps = {
  exam: AdminExamCardItem;
};

export default function AdminExamCard({ exam }: AdminExamCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const { mutate: removeExam, isPending: isDeletingExam } = useMutation({
    mutationFn: () => deleteExamById(exam.id),
    onSuccess: (response) => {
      toast.success(response?.message || "Exam deleted successfully", {
        position: "top-right",
      });
      setConfirmDeleteOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-exams"] });
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to delete exam", {
        position: "top-right",
      });
    },
  });

  const goToDetails = () => {
    router.push(`/exams/${exam.id}`);
  };

  const goToEdit = () => {
    router.push(`/exams/${exam.id}/edit`);
  };

  return (
    <>
      <div
      role="button"
      tabIndex={0}
      onClick={goToDetails}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToDetails();
        }
      }}
      className="grid cursor-pointer grid-cols-[56px_1fr_1fr_120px_40px] items-center gap-3 border-b border-gray-100 px-3 py-2 text-sm transition-colors hover:bg-gray-50 sm:gap-4 sm:px-4"
    >
      <div className="relative h-12 w-12 overflow-hidden border border-gray-200 bg-gray-100">
        {exam.image ? (
          <Image
            unoptimized
            src={exam.image}
            alt={exam.title}
            fill
            className="object-cover"
            sizes="48px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-700 to-slate-900 text-sm font-bold text-white">
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

      <p className="truncate font-medium text-gray-800" title={exam.title}>
        {exam.title}
      </p>

      <p className="truncate text-gray-600" title={exam.diplomaTitle}>
        {exam.diplomaTitle}
      </p>

      <p className="text-gray-700">{exam.questionsCount}</p>

      <div
        className="flex justify-end"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded p-1 text-gray-500 outline-none hover:bg-gray-100 hover:text-gray-800">
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="font-sans bg-white">
            <DropdownMenuItem className="cursor-pointer" onClick={goToDetails}>
              View
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={goToEdit}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
              disabled={exam.immutable}
              onClick={() => setConfirmDeleteOpen(true)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      </div>

      <ConfirmDeleteModal
        open={confirmDeleteOpen}
        title="Delete this exam?"
        description="This will permanently delete the exam and related question data."
        deleteLabel="Delete"
        isPending={isDeletingExam}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={() => removeExam()}
      />
    </>
  );
}
