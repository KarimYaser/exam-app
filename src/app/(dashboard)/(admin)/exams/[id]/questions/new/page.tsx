import { notFound } from "next/navigation";
import isAdmin from "@/lib/util/is-admin";
import Unauthorized from "@/app/unauthorized";
import { getAdminExams } from "../../../_actions/exams.actions";
import CreateQuestionForm from "./_components/create-question-form";

interface AddQuestionPageProps {
  params: Promise<{ id: string }>;
}

export default async function AddQuestionPage({ params }: AddQuestionPageProps) {
  const resolvedParams = await params;
  const examId = resolvedParams.id;

  const examsResponse = await getAdminExams(1, 100);
  const exam = examsResponse?.payload?.data?.find((item) => item.id === examId);

  if (!exam) {
    notFound();
  }
const isAdminUser = await isAdmin();
  return <>
  {isAdminUser? 
  <CreateQuestionForm examId={examId} examTitle={exam.title} />: <Unauthorized />
  }
  </>
}
