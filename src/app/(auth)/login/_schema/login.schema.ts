import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .nonempty("Username is required")
    .min(3, "Username must be at least 3 characters long")
    .max(25, "Username must be at most 25 characters long"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!*%#$@?:(){}^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
});

export type loginFormValues = z.infer<typeof loginSchema>;
