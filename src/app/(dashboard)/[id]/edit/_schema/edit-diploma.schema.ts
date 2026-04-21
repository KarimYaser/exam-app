import { z } from "zod";

export const editDiplomaSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  image: z.string().trim().min(1, "Image is required"),
});

export type EditDiplomaFormValues = z.infer<typeof editDiplomaSchema>;
