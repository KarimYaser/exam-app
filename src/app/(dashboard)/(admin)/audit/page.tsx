import AdminAuditDashboard from "./_components/admin-audit-dashboard";
import isAdmin from "@/lib/util/is-admin";
import Unauthorized from "../../unauthorized";

export default async function AdminAuditPage() {
  const isAdminUser = await isAdmin();
  if (!isAdminUser) {
    return <Unauthorized />;
  }

  return <AdminAuditDashboard />;
}
