// import { cookies } from 'next/headers'
import { authOptions } from "@/auth";
import React from "react";
import { getServerSession } from "next-auth";

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
  // const roleCookie = await cookies();
  // const role = roleCookie.get('role')?.value;
  const session = await getServerSession(authOptions);
  return (
    <div className="bg-red-500 p-4">
      <h1>OverviewLayout</h1>

      {!children && (
        <main className="bg-zinc-800 flex items-center justify-center">
          {session?.user.role === "ADMIN" ? admin : user}
        </main>
      )}

      {/* {admin} */}

      {/* {user} */}

      {children}
      <h2>hello from overview layout</h2>
    </div>
  );
}
