import isAdmin from "@/lib/util/is-admin";
import Unauthorized from "../../unauthorized";
import AdminExamsDashboard from "./_components/admin-exams-dashboard";

export default async function AdminExamsPage() {
  const isAdminUser= await isAdmin()
 
   return<>
  {isAdminUser ? <AdminExamsDashboard /> : <Unauthorized />};
  </>
}
