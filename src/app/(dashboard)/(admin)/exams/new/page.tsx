import { getDiplomas } from "@/app/(dashboard)/_actions/diplomas.actions";
import { CreateExamForm } from "./_components/create-exam-form";
import isAdmin from "@/lib/util/is-admin";
import Unauthorized from "@/app/unauthorized";
import isSuperAdmin from "@/lib/util/is-super-admin";

export default async function AddNewExamPage() {
  const diplomasResponse = await getDiplomas(1, 200);
  const diplomas = diplomasResponse?.payload?.data ?? [];
  const isAdminUser= await isAdmin()
  const isSuperAdminUser =await isSuperAdmin()
 if(!isAdminUser && !isSuperAdminUser){
<Unauthorized />
 }

  return <>
  <CreateExamForm diplomas={diplomas} questions={[]} />
  </> 
}
