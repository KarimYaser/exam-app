"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  EllipsisVertical,
  FolderCode,
  GraduationCap,
  LayoutGrid,
  ListOrdered,
  LogOut,
  Menu,
  UserRound,
  Edit3,
  X,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import elevateLogo from "../../../../../public/assets/logo2.png";
import avatar from "../../../../../public/assets/user-photo.jpg";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile } from "../../_actions/userProfile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { SessionProvider, signOut, useSession } from "next-auth/react";

const navItems = [
  { label: "Diplomas", href: "/", icon: GraduationCap },
  { label: "Exams", href: "/exams", icon: BookOpen },
  { label: "Account Settings", href: "/settings", icon: UserRound },
  { label: "Audit Log", href: "/audit", icon: ListOrdered },
];

function AdminSidebarContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: getProfile,
    retry: 1,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const user = userData?.payload?.user ?? {
    firstName: session?.user?.firstName || "Firstname",
    email: session?.user?.email || "user-email@example.com",
    profilePhoto: session?.user?.profilePhoto || null,
  };

  const handleLogout = async () => {
    toast.success("Logged out successfully");
    setTimeout(async () => {
      await signOut({ redirect: false });
      router.push("/login");
      queryClient.removeQueries({
        queryKey: ["user"],
      }); /* this to clean the cache for user */
    }, 1500);
  };

  return (
    <>
      <div className="md:hidden flex shrink-0 items-center justify-between border-b border-gray-300 bg-gray-800 p-4 z-30 sticky top-0 w-[362px]">
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => router.push("/")}
        >
          {/* <Image src={logo} alt="Logo" width={30} height={30} /> */}
          <FolderCode size={25} className="text-slate-300 bg-transparent" />
          <span className="text-sm font-semibold text-slate-100 font-mono">
            Exam App
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="text-slate-300 hover:text-white focus:outline-none"
        >
          <Menu size={24} />
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-56 transform border-r border-gray-300 bg-gray-800 flex flex-col h-full min-h-screen transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky md:top-0 font-mono ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="md:hidden flex justify-end p-3">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-3 p-5">
          <Image
            src={elevateLogo}
            alt="Elevate"
            className="mt-1 max-h-8 w-auto object-contain opacity-90 cursor-pointer"
            width={120}
            height={32}
            onClick={() => {
              router.push("/");
              setIsOpen(false);
            }}
          />
          <div className="flex items-center gap-2 ml-2.5">
            {/* <Image src={logo} alt="Logo" width={26} height={26} className="invert opacity-90" /> */}
            <FolderCode size={25} className="text-slate-300 bg-transparent" />
            <span className="text-sm font-medium text-slate-300">Exam App</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-700/90 text-white border border-slate-500/60"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${isActive ? "text-slate-100" : "text-slate-500"}`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 px-3 py-4 flex items-center gap-3">
          <div className="h-11 w-11 shrink-0 overflow-hidden border border-slate-700 bg-slate-800 shadow-sm">
            {isMounted && user?.profilePhoto ? (
              <Image
                src={user.profilePhoto}
                alt="User Profile"
                width={44}
                height={44}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#E4E6EB] text-[#8A8D91]">
                <User className="h-6 w-6" strokeWidth={1.5} />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-100 truncate">
              {user?.firstName ?? "Firstname"}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {user?.email ?? "user-email@example.com"}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-slate-500 hover:text-slate-200 transition shrink-0 outline-none">
              <EllipsisVertical size={18} className="cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="end"
              className="w-48 font-sans text-white bg-gray-800/90 backdrop-blur-sm border border-gray-700"
            >
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/settings");
                  }}
                  className="cursor-pointer hover:bg-gray-900/50 "
                >
                  <UserRound className="mr-2 h-4 w-4" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/");
                  }}
                  className="cursor-pointer hover:bg-gray-900/50"
                >
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Application
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleLogout()}
                className="text-red-500 hover:bg-red-950/50 hover:text-red-400 focus:bg-red-950/50 cursor-pointer transition-colors ease-in-out"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  );
}

export default function AdminSidebar() {
  return (
    <SessionProvider>
      <AdminSidebarContent />
    </SessionProvider>
  );
}
