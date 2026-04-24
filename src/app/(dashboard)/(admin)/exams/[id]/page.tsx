import { notFound } from "next/navigation";
import AdminExamDetails from "./_components/admin-exam-details";
import { getAdminExams } from "../_actions/exams.actions";
import { getExamQuestions } from "./questions/_actions/questions.actions";
import isAdmin from "@/lib/util/is-admin";
import Unauthorized from "@/app/unauthorized";
import isSuperAdmin from "@/lib/util/is-super-admin";

interface ExamDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ExamDetailsPage({
  params,
}: ExamDetailsPageProps) {
  const resolvedParams = await params;
  const examId = resolvedParams.id;

  const examsResponse = await getAdminExams(1, 100);
  const exam = examsResponse?.payload?.data?.find((item) => item.id === examId);

  const questionsResponse = await getExamQuestions(examId);
  const questions =
    questionsResponse?.payload?.questions ??
    questionsResponse?.payload?.data ??
    [];
  const isAdminUser = await isAdmin();
  const isSuperAdminUser = await isSuperAdmin();
  if (!isAdminUser && !isSuperAdminUser) {
    return <Unauthorized />;
  }
  if (!exam) {
    notFound();
  }
  return (
    <>
        <AdminExamDetails exam={exam} questions={questions} />
    </>
  );
}
