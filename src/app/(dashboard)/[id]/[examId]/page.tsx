import React from "react";
import { getExamQuestions } from "@/app/(dashboard)/(admin)/exams/[id]/questions/_actions/questions.actions";
import ExamQuestions from "./_components/exam-questions";
import isAdmin from "@/lib/util/is-admin";
import isSuperAdmin from "@/lib/util/is-super-admin";
import Unauthorized from "@/app/unauthorized";

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
  const isAdminUser = await isAdmin();
  const isSuperAdminUser = await isSuperAdmin();
  if (!isAdminUser && !isSuperAdminUser) {
    return (
      <ExamQuestions /* user access only */
        examId={examId}
        diplomaId={diplomaId}
        diplomaName={decodeURIComponent(diplomaName)}
        examName={decodeURIComponent(examName)}
      />
    );
  }
  return <Unauthorized />;
}
