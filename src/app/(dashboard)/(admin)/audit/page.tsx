import AdminAuditDashboard from "./_components/admin-audit-dashboard";
import isAdmin from "@/lib/util/is-admin";
import isSuperAdmin from "@/lib/util/is-super-admin";
import Unauthorized from "../../unauthorized";

export default async function AdminAuditPage() {
  const isAdminUser = await isAdmin();
  const isSuperAdminUser = await isSuperAdmin();

  if (!isAdminUser && !isSuperAdminUser) {
    return <Unauthorized />;
  }

  return <AdminAuditDashboard isSuperAdminUser={isSuperAdminUser} />;
}
