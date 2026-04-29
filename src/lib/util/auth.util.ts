import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function getNextAuthToken() {
  const cookiesStore = await cookies();
  const envCookieName = process.env.NEXTAUTH_SESSION_COOKIE;
  const candidateCookieNames = [
    envCookieName,
    "__Secure-next-auth.session-token",
    "__Host-next-auth.csrf-token",
    "next-auth.session-token",
  ].filter(Boolean) as string[];
  const token = candidateCookieNames
    .map((name) => cookiesStore.get(name)?.value)
    .find(Boolean);
  // console.log("envCookieName", envCookieName);
  // console.log("token", token);
  try {
    const jwt = await decode({
      token,
      secret: process.env.NEXTAUTH_SECRET!,
    });
    // console.log("jwt", jwt);
    return jwt;
  } catch (error) {
    void error;

    return null;
  }
}
