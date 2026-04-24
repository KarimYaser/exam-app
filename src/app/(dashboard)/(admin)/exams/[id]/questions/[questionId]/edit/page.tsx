import { notFound } from "next/navigation";
import isAdmin from "@/lib/util/is-admin";
import Unauthorized from "@/app/unauthorized";
import { getAdminExams } from "../../../../_actions/exams.actions";
import { getQuestionById } from "@/app/(dashboard)/(admin)/exams/[id]/questions/_actions/questions.actions";
import EditQuestionForm from "./_components/edit-question-form";
import isSuperAdmin from "@/lib/util/is-super-admin";

interface EditQuestionPageProps {
  params: Promise<{ id: string; questionId: string }>;
}

export default async function EditQuestionPage({
  params,
}: EditQuestionPageProps) {
  
  const isAdminUser= await isAdmin()
  const isSuperAdminUser =await isSuperAdmin()
 if(!isAdminUser && !isSuperAdminUser){
<Unauthorized />
 }

  const resolvedParams = await params;
  const examId = resolvedParams.id;
  const questionId = resolvedParams.questionId;

  const [examsResponse, questionResponse] = await Promise.all([
    getAdminExams(1, 100),
    getQuestionById(questionId),
  ]);

  const exam = examsResponse?.payload?.data?.find((item) => item.id === examId);
  const question =
    questionResponse?.payload?.question ?? questionResponse?.question;

  if (!exam || !question) {
    notFound();
  }

  return (
    <EditQuestionForm
      examId={examId}
      examTitle={exam.title}
      question={question}
    />
  );
}
