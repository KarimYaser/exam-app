import { notFound } from "next/navigation";
import AdminExamDetails from "./_components/admin-exam-details";
import { getAdminExams } from "../_actions/exams.actions";
import { getExamQuestions } from "../../../[id]/[examId]/_actions/questions.actions";

interface ExamDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ExamDetailsPage({ params }: ExamDetailsPageProps) {
  const resolvedParams = await params;
  const examId = resolvedParams.id;

  const examsResponse = await getAdminExams(1, 100);
  const exam = examsResponse?.payload?.data?.find((item) => item.id === examId);

  const questionsResponse = await getExamQuestions(examId);
  const questions =
    questionsResponse?.payload?.questions ?? questionsResponse?.payload?.data ?? [];

  return <AdminExamDetails exam={exam} questions={questions} />;
}
