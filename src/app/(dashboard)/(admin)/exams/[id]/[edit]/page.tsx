import { notFound } from "next/navigation";
import { getDiplomas } from "@/app/(dashboard)/_actions/diplomas.actions";
import { getExamQuestions } from "../../../../[id]/[examId]/_actions/questions.actions";
import { getAdminExams } from "../../_actions/exams.actions";
import EditExamForm from "./_components/edit-exam-form";

interface EditExamPageProps {
  params: Promise<{ id: string; edit: string }>;
}

export default async function ExamEditPage({ params }: EditExamPageProps) {
  const resolvedParams = await params;
  const examId = resolvedParams.id;

  const [examsResponse, diplomasResponse, questionsResponse] = await Promise.all([
    getAdminExams(1, 100),
    getDiplomas(1, 100),
    getExamQuestions(examId),
  ]);

  const exam = examsResponse?.payload?.data?.find((item) => item.id === examId);
  if (!exam) {
    notFound();
  }

  const diplomas = diplomasResponse?.payload?.data ?? [];
  const questionsRaw =
    questionsResponse?.payload?.questions ?? questionsResponse?.payload?.data ?? [];
  const questions = questionsRaw.map((q) => ({ id: q.id, text: q.text }));

  return <EditExamForm exam={exam} diplomas={diplomas} questions={questions} />;
}
