import { z } from "zod";

export const newDiplomaSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  image: z.string().trim().min(1, "Image is required"),
});

export type NewDiplomaFormValues = z.infer<typeof newDiplomaSchema>;
