"use client";

import { useState } from "react";
import {
  EllipsisVertical,
  GraduationCap,
  LogOut,
  UserRound,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import elevateLogo from "../../../../public/assets/logo2.png";
import Image from "next/image";
import logo from "../../../../public/assets/lucide/folder-code.svg";
import avatar from "../../../../public/assets/user-photo.jpg";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile } from "../_actions/userProfile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { removeTokenCookie } from "@/app/(auth)/_actions/auth.actions";
import { toast } from "sonner";
import { signOut, useSession } from "next-auth/react";
const navItems = [
  {
    label: "Diplomas",
    href: "/",
    icon: <GraduationCap />,
  },
  {
    label: "Account Settings",
    href: "/settings",
    icon: <UserRound />,
  },
];

export default function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: getProfile,
    retry: 1,
  });
  // console.log("userData", userData);
  // console.log("session", session);
  // Fall back to placeholder text until the API resolves
  const user = userData?.payload?.user ?? {
    firstName: session?.user?.firstName || "firstName",
    email: session?.user?.email || "email",
  };
  // console.log("user", user);
  const handleLogout = async () => {
    // removeTokenCookie(); // Clear legacy cookies
    toast.success("Logged out successfully");
    setTimeout(async () => {
      await signOut({ redirect: false });
      router.push("/login");
      router.refresh();
    }, 2000);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex flex-shrink-0 items-center justify-between p-4 bg-white border-b border-gray-200 z-30 sticky top-0">
        <div className="flex items-center gap-2.5">
          <Image src={logo} alt="Logo" width={24} height={24} />
          <span className="text-sm font-semibold text-blue-600">Exam App</span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-56 transform bg-blue-50 border-r border-gray-200 flex flex-col h-full min-h-screen transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky md:top-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Close Button */}
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-800 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>
      {/* Logo */}
      <div className="flex items-start flex-col gap-2.5 px-5 py-5">

        <Image
          src={elevateLogo}
          alt="Logo"
          className="text-black bg-black p-1"
          
        />

        <div className="flex items-center gap-2.5 mt-1">
          <Image src={logo} alt="Logo" width={30} height={30} />
          <span className="text-xs font-semibold text-blue-600">Exam App</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
              <Link
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-100 text-blue-600 border border-blue-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span
                className={`w-6 h-6 ${isActive ? "text-blue-600" : "text-gray-400"}`}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User profile */}
      <div className="px-4 py-4 border-t border-gray-100 flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-300 overflow-hidden shrink-0">
          {/* Avatar placeholder */}
          <Image src={avatar} alt="Logo" width={54} height={54} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-blue-600 truncate">
            {user?.firstName || "firstName"}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {user?.email || "email"}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            // asChild
            className="text-gray-400 hover:text-gray-600 transition shrink-0 outline-none"
          >
            <EllipsisVertical size={18} className="cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="end" className="w-48 p-4 mb-4">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  setIsOpen(false);
                  router.push("/settings");
                }}
                className="cursor-pointer"
              >
                <UserRound className="mr-2 h-4 w-4" />
                <span>Account</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleLogout()}
              className="text-red-500 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
    </>
  );
}
