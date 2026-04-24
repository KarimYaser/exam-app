import { notFound } from "next/navigation";
import isAdmin from "@/lib/util/is-admin";
import Unauthorized from "@/app/unauthorized";
import { getAdminExams } from "../../../../_actions/exams.actions";
import BulkAddForm from "./_components/bulk-add-form";
import isSuperAdmin from "@/lib/util/is-super-admin";

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
  const isAdminUser= await isAdmin()
  const isSuperAdminUser =await isSuperAdmin()
 if(!isAdminUser && !isSuperAdminUser){
<Unauthorized />
 }
  return (
    <>
        <BulkAddForm examId={examId} examTitle={exam.title} />
    </>
  );
}
