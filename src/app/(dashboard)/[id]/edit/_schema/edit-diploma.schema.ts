import { z } from "zod";

export const editDiplomaSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  image: z
    .string()
    .trim()
    .min(1, "Image is required")
    .refine(
      (value) =>
        value.startsWith("/api/upload/temp/") ||
        value.startsWith("http://") ||
        value.startsWith("https://"),
      "Image must be an HTTP(S) URL or a temp upload URL",
    ),
});

export type EditDiplomaFormValues = z.infer<typeof editDiplomaSchema>;
