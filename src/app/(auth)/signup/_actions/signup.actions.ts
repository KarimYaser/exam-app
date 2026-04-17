"use server";

import { signupFormValues } from "../_schema/signup.schema";

export interface ActionResponse {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
  data?: unknown;
}

export async function signupAction(
  values: signupFormValues,
): Promise<ActionResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Safely map form values to API expected payload

      body: JSON.stringify({
        username: values.username,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        phone: values.phone,
      }),
    });

    const data = await response.json();
    // console.log("[register API raw response]", data);

    if (!response.ok) {
      // API may return errors as an array [{field, message}] or as a key-value object
      if (data.errors) {
        const errorsNormalized: Record<string, string> =
          {}; /* this is for normalize errors */
        if (Array.isArray(data.errors)) {
          // Array format: [{field: 'phone', message: '...'}, ...]
          data.errors.forEach(
            (err: {
              field?: string;
              message?: string;
              msg?: string;
              path?: string;
            }) => {
              const field = err.field || err.path || "api";
              const message = err.message || err.msg || "Invalid value";
              errorsNormalized[field] = message;
            },
          );
        } else if (typeof data.errors === "object") {
          // Object format: { phone: '...', email: '...' }
          Object.assign(errorsNormalized, data.errors);
        }
        // this is for get first message
        const firstMsg = Object.values(errorsNormalized)[0];
        return {
          success: false,
          message: firstMsg,
          errors: errorsNormalized,
        }; /* this is for normalize errors */
      }
      return {
        success: false,
        message: data.message || "Registration failed",
      };
    }

    return {
      success: true,
      message: data.message || "Registration successful!",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Network error occurred",
      errors: { api: error.message },
    };
  }
}

export async function sendVerificationCode(
  email: string,
): Promise<ActionResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${baseUrl}/auth/send-email-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, message: data.message || "Failed to send code" };
    }
    return { success: true, message: data.message || "Code sent successfully" };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function verifyCode(
  email: string,
  code: string,
): Promise<ActionResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${baseUrl}/auth/confirm-email-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Invalid or expired code",
      };
    }
    return { success: true, message: data.message || "Email verified" };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
