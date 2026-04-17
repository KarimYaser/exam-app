export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface ActionResponse {
  status: boolean;
  code: number;
  message: string;
  errors?: Record<string, string>;
  data?: unknown;
}

export async function resetPasswordAction(
  payload: ResetPasswordPayload,
): Promise<ActionResponse> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data: ActionResponse = await response.json();
    // console.log("Reset password response:", data);
    return data;
  } catch (error) {
    // console.log("Failed to reset password:", error);
    throw error;
  }
}
