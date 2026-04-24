import ExamsContent from "./_components/exams-content";
import DiplomaDetails from "./_components/admin/admin-diploma-details";
import { TRole } from "@/lib/types/user";
import { getProfile } from "../_actions/userProfile";
import { USER_ROLES } from "@/lib/constants/api.constant";
import { getDiplomas } from "../_actions/diplomas.actions";
import isAdmin from "@/lib/util/is-admin";
import isSuperAdmin from "@/lib/util/is-super-admin";
import Unauthorized from "@/app/unauthorized";

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
  const isSuperAdminUser=await isSuperAdmin()
  
  const diplomasResponse = isAdminUser ? await getDiplomas(1, 100) : null;
  const diploma = diplomasResponse?.payload?.data?.find(
    (item) => item.id === diplomaId,
  );

  const diplomaTitle =
    (resolvedSearchParams.title as string) || diploma?.title || "Diploma";
    // console.log(!isAdminUser && !isSuperAdminUser)
if(!isAdminUser && !isSuperAdminUser){
  return <ExamsContent diplomaId={diplomaId} diplomaTitle={diplomaTitle} />
}
return (
    <>
<DiplomaDetails diploma={diploma} /> 
        
    </>
  );
}
