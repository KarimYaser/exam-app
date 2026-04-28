"use server";

import { getNextAuthToken } from "@/lib/util/auth.util";
import { Diploma } from "../../_actions/diplomas.actions";

export interface CreateDiplomaInput {
  title: string;
  description: string;
  image: string;
}

export interface CreateDiplomaResponse {
  status: boolean;
  code: number;
  message: string;
  payload: {
    diploma: Diploma;
  };
}

export async function createDiploma(
  values: CreateDiplomaInput,
): Promise<CreateDiplomaResponse> {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${baseUrl}/diplomas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    const payload = (await response.json()) as CreateDiplomaResponse;

    if (!response.ok) {
      throw new Error(payload?.message || "Failed to create diploma");
    }

    return payload;
  } catch (error) {
    throw error;
  }
}
