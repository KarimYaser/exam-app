"use server";

import { getNextAuthToken } from "@/lib/util/auth.util";
import { ExamsListResponse } from "../_types/exam";



export async function getExams(diplomaId: string): Promise<ExamsListResponse> {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  

  try {
    const response = await fetch(
      `${baseUrl}/exams?diplomaId=${diplomaId}&page=1&limit=20`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );
    
        const payload: ExamsListResponse = await response.json();
        console.log("payload:", payload);

    if (!response.ok) {
      console.error("Failed to fetch exams:", response.status);
      return { payload: { data: [] } };
    }
    return payload;
  } catch (error) {
    console.error("Error fetching exams:", error);
    throw error;
  }
}