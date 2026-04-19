import ExamsContent from "./_components/exams-content";
import DiplomaDetails from "./_components/admin/diploma-details";
import { TRole } from "@/lib/types/user";
import { getProfile } from "../_actions/userProfile";
import { USER_ROLES } from "@/lib/constants/api.constant";
import { getDiplomas } from "../_actions/diplomas.actions";
import isAdmin from "@/lib/util/is-admin";

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

  const isAdminUser = await isAdmin();
  const diplomasResponse = isAdminUser ? await getDiplomas(1, 20) : null;
  const diploma = diplomasResponse?.payload?.data?.find(
    (item) => item.id === diplomaId,
  );

  const diplomaTitle =
    (resolvedSearchParams.title as string) || diploma?.title || "Diploma";

  return (
    <>
      { isAdminUser ? (
        <DiplomaDetails      
            diploma={diploma}
        />
      ) : (
        <ExamsContent diplomaId={diplomaId} diplomaTitle={diplomaTitle} />
      )}
    </>
  );
}
