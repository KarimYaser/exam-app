export interface ActionResponse {
  status: boolean;
  code: number;
  message?: string;
  errors?: Record<string, string>;
  data?: unknown;
}

export async function forgetPasswordAction(values: {
  email: string;
}): Promise<ActionResponse> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: values.email }),
    });

    const payload: ActionResponse = await response.json();
    // console.log("Forget password response:", payload);
    return payload;
  } catch (error) {
    // console.log("Failed to send forgot password email:", error);
    throw error;
  }
}
