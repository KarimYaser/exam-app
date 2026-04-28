"use server";

import { ILoginFields } from "@/lib/types/auth";
// @ts-ignore
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Server Actions
const DATABASE = [
  {
    id: 1,
    username: "abdulrahman",
    password: "$2b$08$uBi63.lFaeyGsd8c4QzXIeRLWKAxfBBVYwub1ppSczN/9LdtuNFjq",
  },
];

export async function loginAction(fields: ILoginFields) {
  // Indentification
  const user = DATABASE.find((user) => user.username === fields.username);
  if (!user) return { status: false, message: "Invalid credentials" };

  // Authentication
  const isCorrectPassword = await bcrypt.compare(
    fields.password,
    user.password,
  );
  if (!isCorrectPassword)
    return { status: false, message: "Invalid credentials" };

  // Generate Token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  const cookiesStore = await cookies();

  cookiesStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    path: "/",
  });
}

// export async function loginAction(fields: ILoginFields) {
//   const response = await fetch('https://exam-app.elevate-bootcamp.cloud/api/auth/login', {
//     method: 'POST',
//     body: JSON.stringify(fields),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })

//   const payload: IApiResponse<ILoginResponse> = await response.json();

//   if (payload.status !== true) {
//     throw new Error(payload.message);
//   }

//   if (payload.payload?.token) {
//     // localStorage.setItem('token', data.payload.token);
//     const cookiesStore = await cookies();
//     cookiesStore.set('token', payload.payload.token, {
//       httpOnly: true, // XSS Protection
//       sameSite: 'lax', // CSRF Protection (CSRF Token preferably)
//       expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
//       secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
//     })
//   }
// }
