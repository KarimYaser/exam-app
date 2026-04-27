"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AdminExam } from "../../_types/admin-exam";
import { toast } from "sonner";
import { deleteQuestionById } from "@/app/(dashboard)/(admin)/exams/[id]/questions/_actions/questions.actions";
import { deleteExamById } from "../../_actions/exams.actions";
import ConfirmDeleteModal from "@/components/shared/confirm-delete-modal";
import AdminExamHeader from "./admin-exam-details-header";
import AdminExamInfo from "./admin-exam-details-info";
import AdminExamQuestionsList, {
  ExamQuestionItem,
} from "./admin-exam-details-questions-list";

type AdminExamDetailsProps = {
  exam: AdminExam;
  questions: ExamQuestionItem[];
};

export default function AdminExamDetails({
  exam,
  questions,
}: AdminExamDetailsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
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

  const questionsCount =
    exam._count?.questions ?? exam.questionsCount ?? questions.length;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f4f5f7] font-mono text-[13px] overflow-y-auto">
      <AdminExamHeader
        exam={exam}
        onDeleteClick={() => setConfirmDeleteExamOpen(true)}
      />

      <div className="px-4 py-4 sm:px-6">
        <AdminExamInfo exam={exam} questionsCount={questionsCount} />

        <AdminExamQuestionsList
          examId={exam.id}
          examTitle={exam.title}
          questions={questions}
          isDeletingQuestion={isDeletingQuestion}
          onDeleteQuestion={deleteQuestion}
        />
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
