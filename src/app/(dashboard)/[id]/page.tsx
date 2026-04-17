import { get } from "http";
import ExamsContent from "./_components/exams-content";
import { getExams } from "./_actions/exams.actions";

interface DiplomaExamsPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DiplomaExamsPage({
  params,
  searchParams,
}: DiplomaExamsPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const diplomaId = resolvedParams.id;
  // console.log("Diploma ID:", diplomaId);
  const diplomaTitle = (resolvedSearchParams.title as string) || "Diploma";

  return (
    <>
    <ExamsContent diplomaId={diplomaId} diplomaTitle={diplomaTitle} />
    </>
  );
}
