"use server";

import { getNextAuthToken } from "@/lib/util/auth.util";

export interface UploadDiplomaImageResponse {
  url: string;
}

function extractUploadUrl(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;

  const data = payload as Record<string, unknown>;
  if (typeof data.url === "string" && data.url.trim()) {
    return data.url;
  }

  if (data.payload && typeof data.payload === "object") {
    const nested = data.payload as Record<string, unknown>;
    if (typeof nested.url === "string" && nested.url.trim()) {
      return nested.url;
    }
  }

  return null;
}

function extractErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;

  const data = payload as Record<string, unknown>;
  if (typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }

  if (typeof data.error === "string" && data.error.trim()) {
    return data.error;
  }

  if (data.payload && typeof data.payload === "object") {
    const nested = data.payload as Record<string, unknown>;
    if (typeof nested.message === "string" && nested.message.trim()) {
      return nested.message;
    }
  }

  return null;
}

export async function uploadDiplomaImage(
  formData: FormData,
): Promise<UploadDiplomaImageResponse> {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const file = formData.get("image");
  if (!(file instanceof File)) {
    throw new Error("No image file provided");
  }

  const uploadForm = new FormData();
  uploadForm.append("image", file);

  const response = await fetch(`${baseUrl}/upload`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: uploadForm,
  });

  const raw = await response.text();
  let payload: unknown = null;
  try {
    payload = raw ? (JSON.parse(raw) as unknown) : null;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(payload) ??
        `Image upload failed (${response.status})`,
    );
  }

  const url = extractUploadUrl(payload);
  if (!url) {
    throw new Error("Upload succeeded but no temp URL was returned");
  }

  return { url };
}
