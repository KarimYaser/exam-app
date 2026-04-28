import { z } from "zod";

// Answer schema
export const QuestionAnswerSchema = z.object({
  id: z.string(),
  text: z.string(),
});

// Question schema including the correct answer field
export const QuestionSchema = z.object({
  id: z.string(),
  _id: z.string().optional(),
  text: z.string(),
  answers: z.array(QuestionAnswerSchema),
  correctAnswerId: z.string().optional(),
  explanation: z.string().optional(),
});

// Response payload schema for exam questions
export const QuestionsResponseSchema = z.object({
  status: z.boolean().optional(),
  code: z.number().optional(),
  payload: z.object({
    questions: z.array(QuestionSchema),
  }),
});

// Schema for submitting exam answers
export const SubmitAnswersSchema = z.object({
  answers: z.record(z.string(), z.string()), // { questionId: answerId, ... }
});

export type Question = z.infer<typeof QuestionSchema>;
export type QuestionsResponse = z.infer<typeof QuestionsResponseSchema>;
export type SubmitAnswers = z.infer<typeof SubmitAnswersSchema>;
