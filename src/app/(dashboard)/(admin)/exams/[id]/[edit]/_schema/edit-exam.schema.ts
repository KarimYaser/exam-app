import { z } from "zod";

export const editExamSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  image: z.string().trim().min(1, "Image is required"),
  duration: z
    .number({ message: "Duration is required" })
    .int("Duration must be a whole number")
    .positive("Duration must be greater than 0"),
  diplomaId: z.string().trim().min(1, "Diploma is required"),
});

export type EditExamFormValues = z.infer<typeof editExamSchema>;
