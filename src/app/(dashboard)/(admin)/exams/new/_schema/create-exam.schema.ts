import { z } from "zod";

export const createExamSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  image: z.string().trim().min(1, "Image is required"),
  duration: z
    .number({ message: "Duration is required" })
    .refine((value) => !Number.isNaN(value), "Duration is required")
    .int("Duration must be a whole number")
    .positive("Duration must be greater than 0"),
  diplomaInput: z.string().trim().min(1, "Diploma name or id is required"),
});

export type CreateExamFormValues = z.infer<typeof createExamSchema>;
