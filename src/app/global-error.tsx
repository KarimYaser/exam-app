'use client';

import "./globals.css";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <html>
      <body>
        <main className="grow bg-zinc-800 flex flex-col gap-4 items-center justify-center">
          <h1 className="text-white text-4xl font-bold">Something went wrong [GLOBAL ERROR]</h1>

          <p className="text-white text-xl font-bold">{error.message}</p>

          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick={reset}>Try again</button>
        </main>
      </body>
    </html>
  )
}