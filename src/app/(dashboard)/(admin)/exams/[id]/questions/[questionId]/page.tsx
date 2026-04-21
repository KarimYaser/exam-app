import { notFound } from "next/navigation";
import isAdmin from "@/lib/util/is-admin";
import Unauthorized from "@/app/unauthorized";
import { getAdminExams } from "../../../_actions/exams.actions";
import { getQuestionById } from "@/app/(dashboard)/[id]/[examId]/_actions/questions.actions";
import QuestionDetails from "./_components/question-details";

interface QuestionDetailsPageProps {
  params: Promise<{ id: string; questionId: string }>;
}

export default async function QuestionDetailsPage({
  params,
}: QuestionDetailsPageProps) {
  const isAdminUser = await isAdmin();
  if (!isAdminUser) {
    return <Unauthorized />;
  }

  const resolvedParams = await params;
  const examId = resolvedParams.id;
  const questionId = resolvedParams.questionId;

  const [examsResponse, questionResponse] = await Promise.all([
    getAdminExams(1, 100),
    getQuestionById(questionId),
  ]);

  const exam = examsResponse?.payload?.data?.find((item) => item.id === examId);
  const question = questionResponse?.payload?.question ?? questionResponse?.question;

  if (!exam || !question) {
    notFound();
  }

  return (
    <QuestionDetails examId={examId} examTitle={exam.title} question={question} />
  );
}
