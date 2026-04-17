import React from "react";
import DashboardSidebar from "./_components/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Left — static sidebar */}
      <DashboardSidebar />

      {/* Right — dynamic content */}
      <main className="flex-1 h-screen overflow-hidden">{children}</main>
    </div>
  );
}
