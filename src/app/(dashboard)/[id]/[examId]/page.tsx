import React from "react";
import { getExamQuestions } from "@/app/(dashboard)/(admin)/exams/[id]/questions/_actions/questions.actions";
import ExamQuestions from "./_components/exam-questions";

interface ExamSessionPageProps {
  params: Promise<{
    id: string;
    examId: string;
  }>;
  searchParams: Promise<{
    diplomaName?: string;
    examName?: string;
  }>;
}

export default async function ExamSessionPage({
  params,
  searchParams,
}: ExamSessionPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { id: diplomaId, examId } = resolvedParams;
  const { diplomaName = "Diploma", examName = "Exam" } = resolvedSearchParams;

  return (
    <ExamQuestions
      examId={examId}
      diplomaId={diplomaId}
      diplomaName={decodeURIComponent(diplomaName)}
      examName={decodeURIComponent(examName)}
    />
  );
}
