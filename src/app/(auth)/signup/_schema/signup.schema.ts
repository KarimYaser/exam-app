import { z } from "zod";

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .nonempty("First name is required")
      .min(3, "First name must be at least 3 characters long")
      .max(25, "First name must be at most 25 characters long"),
    lastName: z
      .string()
      .nonempty("Last name is required")
      .min(3, "Last name must be at least 3 characters long")
      .max(25, "Last name must be at most 25 characters long"),
    username: z
      .string()
      .nonempty("Username is required")
      .min(3, "Username must be at least 3 characters long")
      .max(25, "Username must be at most 25 characters long"),
    email: z
      .string()
      .nonempty("Email is required")
      .pipe(z.email("Invalid email address")),
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
    confirmPassword: z.string().nonempty("Re-password is required"),
    phone: z
      .string()
      .nonempty("Phone is required")
      .regex(
        /^(\+20)?1[0125][0-9]{8}$/,
        "Invalid Egyptian phone number",
      ) /* example: 01016832988 or +201016832988 */,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type signupFormValues = z.infer<typeof signupSchema>;
