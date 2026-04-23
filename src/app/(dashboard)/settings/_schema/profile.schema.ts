import { z } from "zod";

export const profileSchema = z.object({
  firstName: z
    .string()
    .nonempty("First name is required")
    .min(3, "First name must be at least 3 characters")
    .max(25, "First name must be at most 25 characters"),
  lastName: z
    .string()
    .nonempty("Last name is required")
    .min(3, "Last name must be at least 3 characters")
    .max(25, "Last name must be at most 25 characters"),
  phone: z
    .string()
    .nonempty("Phone is required")
    .regex(
      /^01[0125][0-9]{8}$/,
      "Invalid Egyptian phone number (e.g. 01012345678)",
    ),
  profilePhoto: z.string().nullable().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
