// import { getNextAuthToken } from "@/lib/util/auth.util";
// import { NextResponse } from "next/server";

import { NextRequest, NextResponse } from "next/server";
import { getDiplomas } from "./apis/diploma.api";

export const dynamic = "force-dynamic";

// export async function GET() {
//   const jwt = await getNextAuthToken();
//   const token = jwt?.token;

//   if (!token) {
//     return NextResponse.json({ status: false, message: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/diplomas?page=1&limit=20`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       return NextResponse.json(
//         { status: false, message: "Failed to fetch diplomas from external API" },
//         { status: response.status }
//       );
//     }

//     const data = await response.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("[API_DIPLOMAS_ERROR]", error);
//     return NextResponse.json(
//       { status: false, message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

export async function GET(req: NextRequest) {
  try {
    const payload = await getDiplomas(req);
    return NextResponse.json(payload);
  } catch (error: any) {
    return NextResponse.json(
      { status: false, error: error.message },
      { status: 500 },
    );
  }
}
