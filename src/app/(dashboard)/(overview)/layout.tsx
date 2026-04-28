import React from "react";
import { USER_ROLES } from "@/lib/constants/api.constant";
import { getProfile } from "../_actions/userProfile";
import { TRole } from "@/lib/types/user";
import { redirect } from "next/navigation";

interface OverviewLayoutProps {
  admin: React.ReactNode;
  user: React.ReactNode;
  children: React.ReactNode;
}

export default async function OverviewLayout({
  admin,
  user,
  children,
}: OverviewLayoutProps) {
  const userProfileResponse = await getProfile();
  if (!userProfileResponse?.payload?.user) {
    redirect("/login");
  }
  const role = userProfileResponse?.payload?.user?.role as TRole;
  // console.log("role", role);

  // const session = await getServerSession(authOptions);
  // const role = session?.user.role;
  // console.log("session", session.user);
  const isAdminDashboard =
    role === USER_ROLES.ADMIN || role === USER_ROLES.SUPER_ADMIN;
  const dashboard = isAdminDashboard ? admin : user;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {dashboard}
      {children}
    </div>
  );
}
