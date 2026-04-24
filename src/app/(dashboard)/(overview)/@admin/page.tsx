import isAdmin from "@/lib/util/is-admin";
import AdminDiplomasDashboard from "../../_components/admin/admin-diplomas-dashboard";
import isSuperAdmin from "@/lib/util/is-super-admin";
import Unauthorized from "@/app/unauthorized";

export default async function AdminDashboard() {
  const isAdminUser=await isAdmin()
  const isSuperAdminUser=await isSuperAdmin()
  if(!isAdminUser && !isSuperAdminUser){
    return <Unauthorized/>
  }
  return <AdminDiplomasDashboard />;
}
