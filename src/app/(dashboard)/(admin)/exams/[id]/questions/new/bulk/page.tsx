import { notFound } from "next/navigation";
import isAdmin from "@/lib/util/is-admin";
import Unauthorized from "@/app/unauthorized";
import { getAdminExams } from "../../../_actions/exams.actions";
import BulkAddForm from "./_components/bulk-add-form";

interface BulkAddQuestionsPageProps {
  params: Promise<{ id: string }>;
}

export default async function BulkAddQuestionsPage({
  params,
}: BulkAddQuestionsPageProps) {
  const resolvedParams = await params;
  const examId = resolvedParams.id;

  const examsResponse = await getAdminExams(1, 100);
  const exam = examsResponse?.payload?.data?.find((item) => item.id === examId);

  if (!exam) {
    notFound();
  }

  const isAdminUser = await isAdmin();

  return (
    <>
      {isAdminUser ? (
        <BulkAddForm examId={examId} examTitle={exam.title} />
      ) : (
        <Unauthorized />
      )}
    </>
  );
}
