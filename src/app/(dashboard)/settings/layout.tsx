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
    // router.refresh();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 min-h-screen font-mono">
      {/* Breadcrumb Header */}
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-100 bg-white px-4 py-2 font-mono text-[12px] text-gray-400 sm:px-12">
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
          <div className="max-w-6xl mx-auto w-full ">
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

            <div className="flex flex-col md:flex-row gap-6 lg:gap-10 mt-6 flex-1">
              {/* Sidebar Navigation */}
              <aside className="w-full md:w-64 lg:w-72 shrink-0">
                <div className="flex md:flex-col overflow-x-auto md:overflow-visible gap-2 pb-2 md:pb-0 scrollbar-hide border-b md:border-none border-gray-100">
                  <button
                    onClick={() => router.push("/settings?tab=profile")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-all whitespace-nowrap md:w-full
                   ${
                     activeTab === "profile"
                       ? "bg-blue-50 text-blue-600 font-semibold shadow-sm md:shadow-none"
                       : "text-gray-600 hover:bg-gray-100"
                   }`}
                  >
                    <User
                      size={18}
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-all whitespace-nowrap md:w-full
                   ${
                     activeTab === "password"
                       ? "bg-blue-50 text-blue-600 font-semibold shadow-sm md:shadow-none"
                       : "text-gray-600 hover:bg-gray-100"
                   }`}
                  >
                    <Lock
                      size={18}
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
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-3 px-4 py-3 mt-8 rounded-md text-sm text-red-600 bg-red-50 hover:bg-red-100 transition-all w-full font-semibold border border-red-100"
                >
                  <LogOut size={18} className="rotate-180" /> Logout
                </button>
              </aside>

              {/* Main Content Area */}
              <main className="flex-1 bg-white p-5 sm:p-8 md:p-10 shadow-sm border border-gray-100 rounded-lg min-w-0 h-fit">
                {children}
                
                {/* Logout Button for Mobile */}
                <button
                  onClick={handleLogout}
                  className="md:hidden flex items-center gap-3 px-4 py-3 mt-8 rounded-md text-sm text-red-600 bg-red-50 hover:bg-red-100 transition-all w-full font-semibold border border-red-100 justify-center"
                >
                  <LogOut size={18} className="rotate-180" /> Logout
                </button>
              </main>
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
