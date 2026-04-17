import React from "react";
import ReactQueryProvider from "./providers/react-query.provider";
import NextAuthProvider from "./providers/next-auth.provider";
// import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      {/* <TanStackDevtools initialIsOpen={false} /> */}
      <ReactQueryDevtools initialIsOpen={false} />
      <NextAuthProvider>{children}</NextAuthProvider>
    </ReactQueryProvider>
  );
}
