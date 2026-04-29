"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function Error() {
  const router = useRouter();

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-md border border-red-100 bg-red-50/50 p-6 text-center">
        <h1 className="text-xl font-bold text-red-700 font-mono">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-red-600 font-mono">
          Please try again or go back to the home page.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 w-full rounded bg-[#155DFC] px-4 py-2 text-white font-mono font-bold hover:bg-blue-700 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
