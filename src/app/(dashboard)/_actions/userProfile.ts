"use server";
import { removeTokenCookie } from "@/app/(auth)/_actions/auth.actions";
import { getNextAuthToken } from "@/lib/util/auth.util";
import { cookies } from "next/headers";
export interface UserProfile {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  profilePhoto?: string | null;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  role?: string;
}

export interface userResponse {
  status: boolean;
  code: number;
  payload: { user: UserProfile };
  message?: string;
}
export async function getProfile(): Promise<userResponse> {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  // console.log("token", token);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );
  const data: userResponse = await response.json();
  // console.log(data);
  return data;
}

export async function updateProfile(values: UserProfile) {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    },
  );
  const data = await response.json();
  return data;
}

export async function changePassword(values: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/change-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    },
  );
  const data = await response.json();
  return data;
}

export async function deleteAccount() {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/account`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data?.message || `Request failed with status ${response.status}`,
      );
    }
    await removeTokenCookie();

    return data;
  } catch (error) {
    throw error;
  }
}

export async function requestEmailChange(newEmail: string) {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/email/request`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newEmail }),
    },
  );
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data?.message || "Failed to request email change");
  }
  
  return data;
}

export async function confirmEmailChange(code: string) {
  const jwt = await getNextAuthToken();
  const token = jwt?.token;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/email/confirm`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code }),
    },
  );
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data?.message || "Failed to confirm email change");
  }
  
  return data;
}
