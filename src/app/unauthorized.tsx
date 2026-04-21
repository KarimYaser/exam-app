
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function Unauthorized() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.25),transparent_45%),radial-gradient(circle_at_bottom,rgba(239,68,68,0.18),transparent_40%)]" />

      <section className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-sm sm:p-10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-red-400/40 bg-red-500/15 text-red-400">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-red-400/90">
          Access Restricted
        </p>
        <h1 className="mb-3 text-4xl font-black text-white sm:text-5xl">
          Unauthorized
        </h1>
        <p className="mx-auto mb-8 max-w-md text-base leading-relaxed text-slate-300 sm:text-lg">
          You do not have permission to view this page. Please return to the
          dashboard home.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back To Home
        </Link>
      </section>
    </main>
  );
}
