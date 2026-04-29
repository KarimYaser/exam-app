'use client';

import { useRouter } from "next/navigation";
import "./globals.css";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();
  return (
    <html>
      <body>
        <main className="grow bg-white flex flex-col items-center justify-center px-6">
          <div className="w-full max-w-md border border-red-100 bg-red-50/50 p-6 text-center">
            <h1 className="text-xl font-bold text-red-700 font-mono">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-red-600 font-mono">
              {error.message}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <button
                className="w-full rounded bg-[#155DFC] px-4 py-2 text-white font-mono font-bold hover:bg-blue-700 transition"
                onClick={() => {
                  router.push("/");
                }}
              >
                Back to Home
              </button>
              <button
                className="w-full rounded border border-gray-200 bg-white px-4 py-2 text-gray-700 font-mono font-bold hover:bg-gray-50 transition"
                onClick={reset}
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}