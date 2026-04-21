import { z } from "zod";

export const questionAnswerSchema = z.object({
  text: z.string().trim().min(1, "Answer text is required"),
  isCorrect: z.boolean(),
});

export const questionFormSchema = z
  .object({
    text: z.string().trim().min(1, "Question text is required"),
    answers: z
      .array(questionAnswerSchema)
      .min(2, "At least two answers are required"),
  })
  .refine((values) => values.answers.some((answer) => answer.isCorrect), {
    message: "Select one correct answer",
    path: ["answers"],
  });

export type QuestionFormValues = z.infer<typeof questionFormSchema>;
