import isAdmin from "@/lib/util/is-admin";
import Unauthorized from "../../unauthorized";
import AdminExamsDashboard from "./_components/admin-exams-dashboard";
import isSuperAdmin from "@/lib/util/is-super-admin";

export default async function AdminExamsPage() {
  const isAdminUser= await isAdmin()
  const isSuperAdminUser =await isSuperAdmin()
 if(!isAdminUser && !isSuperAdminUser){
<Unauthorized />
 }
   return<> <AdminExamsDashboard />
  </>
}
