import { authOptions } from "@/auth";
import NextAuth from "next-auth";

// Required because `dynamicIO: true` in next.config.ts would otherwise try to
// statically render this route, causing it to throw and return HTML instead of
// JSON — which produces the [next-auth][CLIENT_FETCH_ERROR].
export const dynamic = "force-dynamic";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
