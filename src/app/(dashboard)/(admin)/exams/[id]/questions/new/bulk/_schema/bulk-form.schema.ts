import { z } from "zod";

export const bulkAnswerSchema = z.object({
  text: z.string().trim().min(1, "Answer text is required"),
  isCorrect: z.boolean(),
});

export const bulkQuestionSchema = z
  .object({
    text: z.string().trim().min(1, "Question text is required"),
    answers: z
      .array(bulkAnswerSchema)
      .min(2, "At least two answers are required"),
  })
  .refine((values) => values.answers.some((answer) => answer.isCorrect), {
    message: "Select one correct answer",
    path: ["answers"],
  });

export const bulkQuestionsFormSchema = z.object({
  questions: z
    .array(bulkQuestionSchema)
    .min(1, "At least one question is required"),
});

export type BulkQuestionsFormValues = z.infer<typeof bulkQuestionsFormSchema>;
