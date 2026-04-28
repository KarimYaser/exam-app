import { USER_ROLES } from "@/lib/constants/api.constant";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const userPrivateRoutes = [
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
];

const adminPrivateRoutes = [
  "/",
  "/admin",
  "/settings",
  "/profile",
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
  "/[id]/[id]/[examId]",
];

const authRoutes = [
  "/login",
  "/signup",
  "/forget-password",
  "/reset-password",
];

const trimTrailingSlash = (path: string) =>
  path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;

const toRouteRegex = (pattern: string) => {
  if (pattern === "/") {
    return /^\/$/;
  }

  const escaped = pattern
    .replace(/\//g, "\\/")
    .replace(/\[[^/\]]+\]/g, "[^/]+")
    .replace(/\*\*/g, ".*")
    .replace(/\*/g, "[^/]+?");

  return new RegExp(`^${escaped}$`);
};

const matchesRoute = (pathname: string, routes: string[]) => {
  const normalized = trimTrailingSlash(pathname);
  return routes.some((route) => toRouteRegex(route).test(normalized));
};

export default async function proxy(request: NextRequest) {
  const jwt = await getToken({ req: request });
  const pathname = request.nextUrl.pathname;
  const role = (jwt as { user?: { role?: string } } | null)?.user?.role;
  const isAdminUser =
    role === USER_ROLES.ADMIN || role === USER_ROLES.SUPER_ADMIN;

  // User cannot access private routes without authentication
  // User cannot access auth routes if they are authenticated
  const privateRoutes = isAdminUser ? adminPrivateRoutes : userPrivateRoutes;
  if (matchesRoute(pathname, privateRoutes)) {
    if (jwt) return NextResponse.next(); /* allow all */

    const redirectUrl = new URL("/login", request.nextUrl.origin);

    redirectUrl.searchParams.set("callbackUrl", pathname);

    return NextResponse.redirect(redirectUrl);
  }

  if (matchesRoute(pathname, authRoutes)) {
    if (!jwt) return NextResponse.next(); /* auth route without token => go */

    const redirectUrl = new URL(
      "/",
      request.nextUrl.origin,
    ); /* auth route with token => go to home */
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
