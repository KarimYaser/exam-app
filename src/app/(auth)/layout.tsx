import React from "react";
import Hero from "./_components/hero";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* ── Left side – static branding panel ── */}
      <Hero />

      {/* ── Right side – dynamic auth content ── */}
      <main className="flex flex-1 items-center justify-center bg-white px-8 py-12">
        {children}
      </main>
    </div>
  );
}
