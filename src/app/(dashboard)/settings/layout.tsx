"use client";

import React, { Suspense } from "react";
import { ChevronLeft, User, Lock, LogOut } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { removeTokenCookie } from "../../(auth)/_actions/auth.actions";
import { signOut } from "next-auth/react";

function SettingsLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams?.get("tab") || "profile";
  const handleLogout = async () => {
    removeTokenCookie(); // Optional cleanup for any leftover legacy cookies
    toast.success("Logged out successfully");
    await signOut({ redirect: false });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 min-h-screen font-mono">
      {/* Breadcrumb Header */}
      <div className="px-6 py-3 border-b border-gray-200 bg-white flex items-center gap-2">
        <span
          className="text-xs text-gray-400 cursor-pointer hover:underline"
          onClick={() => router.push("/")}
        >
          Diplomas
        </span>
        <span className="text-xs text-gray-400">/</span>
        <span className="text-xs text-blue-600">Settings</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 w-full">
        <div className="flex flex-col gap-4 h-full">
          {/* Header row to match existing style */}
          <div className="*:h-16 md:*:h-19 flex justify-center items-start gap-2 mb-2 shrink-0">
            <div className="flex justify-center items-center border-[1.5px] border-blue-600 bg-white p-2">
              <ChevronLeft
                className="text-blue-600 cursor-pointer"
                onClick={() => router.push("/")}
                size={34}
              />
            </div>
            <div className="flex grow items-center gap-3 bg-blue-600 text-white px-5 py-3 mb-2">
              <User size={40} className="hidden sm:block" />
              <h1 className="font-semibold text-2xl md:text-3xl">
                Account Settings
              </h1>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mt-4 flex-1">
            {/* Sidebar Navigation */}
            <div className="flex flex-col w-full md:w-72 shrink-0 justify-between">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => router.push("/settings?tab=profile")}
                  className={`flex items-center gap-4 px-6 py-4 rounded-sm text-sm transition-colors w-full text-left
                   ${
                     activeTab === "profile"
                       ? "bg-[#eef2ff] text-blue-600 font-semibold"
                       : "text-gray-500 hover:bg-white bg-transparent"
                   }`}
                >
                  <User
                    size={20}
                    className={
                      activeTab === "profile"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }
                  />
                  Profile
                </button>
                <button
                  onClick={() => router.push("/settings?tab=password")}
                  className={`flex items-center gap-4 px-6 py-4 rounded-sm text-sm transition-colors w-full text-left
                   ${
                     activeTab === "password"
                       ? "bg-[#eef2ff] text-blue-600 font-semibold"
                       : "text-gray-500 hover:bg-white bg-transparent"
                   }`}
                >
                  <Lock
                    size={20}
                    className={
                      activeTab === "password"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }
                  />
                  Change Password
                </button>
              </div>

              <button
                onClick={
                  handleLogout
                  // () =>
                  // signOut({
                  //   callbackUrl: "/login",
                  // })
                }
                className="flex items-center gap-4 cursor-pointer px-6 py-4 mt-12 rounded-sm text-sm text-red-500 bg-[#fff5f5] hover:bg-red-50 transition-colors w-max font-semibold"
              >
                <LogOut size={20} className="rotate-180" /> Logout
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-white p-8 md:p-10 shadow-sm border border-gray-100 rounded-sm">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="p-8 font-mono text-gray-500 animate-pulse">
          Loading settings...
        </div>
      }
    >
      <SettingsLayoutContent>{children}</SettingsLayoutContent>
    </Suspense>
  );
}
