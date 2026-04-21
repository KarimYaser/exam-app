"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getNextAuthToken } from "@/lib/util/auth.util";

export interface UpdateDiplomaInput {
  title: string;
  description: string;
  image: string;
}

export interface UpdateDiplomaResponse {
  status: boolean;
  code: number;
  message: string;
  payload: {
    diploma: {
      id: string;
      title: string;
      description: string;
      image: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export async function updateDiplomaById(
  diplomaId: string,
  values: UpdateDiplomaInput,
): Promise<UpdateDiplomaResponse> {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    console.log(
      "[updateDiplomaById] Sending values:",
      JSON.stringify(values, null, 2),
    );

    const response = await fetch(`${baseUrl}/diplomas/${diplomaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    });

    const payload: UpdateDiplomaResponse = await response.json();

    revalidateTag("diplomas");
    revalidatePath("/");
    revalidatePath(`/${diplomaId}`);

    return payload;
  } catch (error) {
    throw error;
  }
}
