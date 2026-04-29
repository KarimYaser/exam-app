import isAdmin  from "@/lib/util/is-admin";
import { NextRequest, NextResponse } from "next/server";
import { getNextAuthToken } from "./lib/util/auth.util";
import { getToken } from "next-auth/jwt";

const userPrivateRoutes = new Set([
  "/",
  "/overview",
  "/settings",
  "/profile",
  "/exams",
  "/exams/[examId]",
  "/[id]/[examId]",
  "/[id]",
  "/[id]/[id]/[examId]",
  "/audit",
  "/new-diploma",
  "/exams",
  "/exams/new",
  "/exams/[examId]",
  "/exams/[id]",
  "/exams/[id]/edit",
  "/[id]/[examId]",
  "/[id]",
  "/[id]/edit",
  "/[id]/[id]/[examId]"
]);

// const adminPrivateRoutes = new Set([
//   "/",
//   "/admin",
//   "/settings",
//   "/profile",
//   "/audit",
//   "/new-diploma",
//   "/exams",
//   "/exams/new",
//   "/exams/[examId]",
//   "/exams/[id]",
//   "/exams/[id]/edit",
//   "/[id]/[examId]",
//   "/[id]",
//   "/[id]/edit",
//   "/[id]/[id]/[examId]",
// ]);

const authRoutes = new Set([
  "/login",
  "/signup",
  "/forget-password",
  "/reset-password",
]);

export default async function proxy(request: NextRequest) {
  const jwt = await getToken({ req: request });
  const pathname = request.nextUrl.pathname;
const isAdminUser = await isAdmin();

  if (authRoutes.has(pathname)) {
    if (!jwt) return NextResponse.next(); /* auth route without token => go */

    const redirectUrl = new URL(
      "/",
      request.nextUrl.origin,
    ); /* auth route with token => go to home */
    return NextResponse.redirect(redirectUrl);
  }

  // User cannot access private routes without authentication
  // User cannot access auth routes if they are authenticated
  // const privateRoutes = isAdminUser ? adminPrivateRoutes : userPrivateRoutes;
  const privateRoutes = userPrivateRoutes;
  if (privateRoutes.has(pathname)) {
    if (jwt) return NextResponse.next(); /* allow all */

    const redirectUrl = new URL("/login", request.nextUrl.origin);

    redirectUrl.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next(); /* public routes => go */
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico, sitemap.xml, robots.txt (metadata files)
   */
  matcher:
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
};
