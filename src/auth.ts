import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ILoginResponse, IUser } from "./lib/types/user";

declare type IApiResponse<T> = IErrorResponse | ISuccessResponse<T>;

declare interface IErrorResponse {
  status: false;
  code: number;
  message: string;
  errors?: Array<{
    path: string;
    message: string;
  }>;
}

declare interface ISuccessResponse<T> {
  status: true;
  code: number;
  message?: string;
  payload?: T;
}

/** Body shape for `POST /auth/login` success payload */
interface ILoginPayload {
  user: IUser;
  token: string;
}

async function fetchUserProfile(bearerToken: string): Promise<IUser | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    return null;
  }
  const data: IApiResponse<{ user: IUser }> = await res.json();
  if (!data.status || !data.payload?.user) {
    return null;
  }
  return data.payload.user;
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: {
          //   label: "Username",
          //   type: "text",
          //   placeholder: "Enter your username",
        },
        password: {
          //   label: "Password",
          //   type: "password",
          //   placeholder: "Enter your password",
        },
      },
      authorize: async (credentials) => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }),
          },
        );

        if (!response.ok) {
          return null;
        }

        const data: IApiResponse<ILoginResponse> = await response.json();
        if (!data.status) {
          throw new Error(data.message);
        }
        const loginData = data.payload;
        if (!loginData || !loginData.user || !loginData.token) {
          return null;
        }

        return {
          id: loginData.user.id,
          token: loginData.token,
          user: loginData.user,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        // Merge new values sent via update() into the JWT token
        token.user = { ...(token.user as IUser), ...session };
      } else if (user) {
        token.user = user.user;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
