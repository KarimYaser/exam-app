"use server";
import { cookies } from "next/headers";
import { loginFormValues } from "../_schema/login.schema";
import jwt from "jsonwebtoken";

export interface ActionResponse {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
  data?: unknown;
}
export async function LoginAction({
  values,
}: {
  values: loginFormValues;
}): Promise<ActionResponse> {
  const { username, password } = values;
  const baseUrl = "https://exam-app.elevate-bootcamp.cloud/api";

  try {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    // console.log("data", data);

    // API returns { status: true, code: 200, payload: { token, ... } }
    const success = data.status === true && data.code === 200;

    if (success && data.payload?.token) {
      const token = jwt.sign(
        { id: data.payload.user.id },
        process.env.JWT_SECRET!,
        {
          expiresIn: "7d",
        },
      );

      const cookieStore = await cookies();
      cookieStore.set(
        "token",
        token,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        },
        // const cookieStore = await cookies();             //original one before jwt
        // cookieStore.set("token", data.payload.token, {
        //   httpOnly: true,
        //   secure: process.env.NODE_ENV === "production",
        //   sameSite: "lax",
        //   path: "/",
        //   maxAge: 60 * 60 * 24 * 7, // 7 days
        // }
      );
    }

    return {
      success,
      message: data.message,
      data: data.payload,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      message: "Network error occurred",
      errors: { api: message },
    };
  }
}
