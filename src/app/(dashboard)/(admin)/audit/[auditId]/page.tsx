import React from "react";
import { getAuditLogs } from "../_actions/audit.actions";
import AdminAuditDetails from "./_components/admin-audit-details";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import isAdmin from "@/lib/util/is-admin";
import isSuperAdmin from "@/lib/util/is-super-admin";
import Unauthorized from "../../../unauthorized";

export default async function AuditDetailsPage({
  params,
}: {
  params: { auditId: string };
}) {
  const { auditId } = await params;

  // Fetch a set of logs and find the specific one by ID
  // Based on user instruction to "send the id param to search and use find method"
  const response = await getAuditLogs({ limit: 100 });
  const log = response.payload.data.find((l) => l.id === auditId);
  const isAdminUser = await isAdmin();
  const isSuperAdminUser = await isSuperAdmin();
  if (!isAdminUser && !isSuperAdminUser) {
    return <Unauthorized />;
  }
  if (!log) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f4f5f7] p-6 text-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md w-full">
          <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowLeft className="h-8 w-8" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Log Not Found
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            The audit log you are looking for could not be found in the recent
            records.
          </p>
          <Link href="/audit">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Back to Audit Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <AdminAuditDetails log={log} isSuperAdminUser={isSuperAdminUser} />;
}
