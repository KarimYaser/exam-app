import { z } from "zod";

export const changeEmailSchema = z.object({
  newEmail: z.string().email("Please enter a valid email address."),
});

export type ChangeEmailFormValues = z.infer<typeof changeEmailSchema>;
