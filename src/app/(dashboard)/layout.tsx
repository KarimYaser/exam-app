import { redirect } from "next/navigation";
import DashboardSidebar from "./_components/sidebar";
import AdminSidebar from "./_components/admin/admin-sidebar";
import { getProfile } from "./_actions/userProfile";
import { TRole } from "@/lib/types/user";
import { USER_ROLES } from "@/lib/constants/api.constant";
import isAdmin from "@/lib/util/is-admin";
import isSuperAdmin from "@/lib/util/is-super-admin";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const isAdminUser = await isAdmin();
  const isSuperAdminUser = await isSuperAdmin();
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row ">
      {/* Left — static sidebar */}
      {isAdminUser || isSuperAdminUser ? (
        <AdminSidebar />
      ) : (
        <DashboardSidebar />
      )}

      {/* Right — dynamic content (`min-w-0` lets nested scroll areas work inside flex row) */}
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto md:h-screen md:overflow-hidden">
        {children}
      </main>
    </div>
  );
}
