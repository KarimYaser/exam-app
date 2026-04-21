"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Minus, Plus, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  updateQuestionById,
  type QuestionPayload,
  type UpdateQuestionInput,
} from "@/app/(dashboard)/[id]/[examId]/_actions/questions.actions";
import {
  questionFormSchema,
  type QuestionFormValues,
} from "../../../_schema/question-form.schema";

type EditQuestionFormProps = {
  examId: string;
  examTitle: string;
  question: QuestionPayload;
};

export default function EditQuestionForm({
  examId,
  examTitle,
  question,
}: EditQuestionFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const initialAnswers = question.answers.map((answer) => ({
    text: answer.text,
    isCorrect: Boolean(answer.isCorrect),
  }));

  if (!initialAnswers.some((answer) => answer.isCorrect) && initialAnswers[0]) {
    initialAnswers[0].isCorrect = true;
  }

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      text: question.text || "",
      answers:
        initialAnswers.length >= 2
          ? initialAnswers
          : [
              ...initialAnswers,
              { text: "", isCorrect: initialAnswers.length === 0 },
              { text: "", isCorrect: false },
            ].slice(0, 2),
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "answers",
  });

  const answers = watch("answers");

  const { mutate: update, isPending } = useMutation({
    mutationFn: (values: UpdateQuestionInput) =>
      updateQuestionById(question.id, values),
    onSuccess: (response) => {
      toast.success(response?.message || "Question updated successfully", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-exams"] });
      router.push(`/exams/${examId}/questions/${question.id}`);
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to update question", {
        position: "top-right",
      });
    },
  });

  const setCorrectAnswer = (index: number) => {
    answers.forEach((_, answerIndex) => {
      setValue(`answers.${answerIndex}.isCorrect`, answerIndex === index, {
        shouldDirty: true,
        shouldValidate: true,
      });
    });
  };

  const onSubmit = (values: QuestionFormValues) => {
    update({
      text: values.text,
      answers: values.answers,
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#f4f5f7] font-mono text-[13px]">
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4 py-3 text-xs sm:px-6">
        <span className="cursor-pointer text-gray-500 hover:underline" onClick={() => router.push("/exams")}>Exams</span>
        <span className="text-gray-300">/</span>
        <span className="cursor-pointer text-gray-500 hover:underline" onClick={() => router.push(`/exams/${examId}`)}>{examTitle}</span>
        <span className="text-gray-300">/</span>
        <span className="font-semibold text-[#155DFC]">Edit Question</span>
      </div>

      <div className="mb-4 flex flex-col gap-3 border-b border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-800">Edit Question</h1>
          <p className="text-sm text-gray-500">Exam: {examTitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            className="rounded-none bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={() => router.push(`/exams/${examId}/questions/${question.id}`)}
            disabled={isPending}
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-question-form"
            className="rounded-none border-0 bg-[#00BC7D] text-white hover:bg-[#01a66f]"
            disabled={isPending}
          >
            <Save className="h-4 w-4" />
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-6">
        <form
          id="edit-question-form"
          onSubmit={handleSubmit(onSubmit)}
          className="rounded border border-gray-200 bg-white"
        >
          <div className="bg-[#155DFC] px-3 py-2 text-sm font-semibold text-white">
            Question Information
          </div>

          <div className="space-y-4 p-3 sm:p-4">
            <div>
              <label htmlFor="question-text" className="mb-1.5 block text-sm font-medium text-gray-700">
                Question
              </label>
              <textarea
                id="question-text"
                rows={3}
                {...register("text")}
                className="w-full rounded border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#155DFC] focus:ring-2 focus:ring-blue-100"
              />
              {errors.text?.message ? (
                <p className="mt-1 text-xs text-red-500">{errors.text.message}</p>
              ) : null}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Answers</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-none"
                  onClick={() => append({ text: "", isCorrect: false })}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Answer
                </Button>
              </div>

              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCorrectAnswer(index)}
                      className={`h-4 w-4 rounded-full border ${
                        answers[index]?.isCorrect
                          ? "border-[#155DFC] bg-[#155DFC]"
                          : "border-gray-300 bg-white"
                      }`}
                      title="Set as correct answer"
                    />
                    <input
                      type="text"
                      {...register(`answers.${index}.text`)}
                      placeholder={`Answer ${index + 1}`}
                      className="h-10 flex-1 rounded border border-gray-200 px-3 text-sm outline-none focus:border-[#155DFC] focus:ring-2 focus:ring-blue-100"
                    />
                    <input type="hidden" {...register(`answers.${index}.isCorrect`)} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => remove(index)}
                      disabled={fields.length <= 2}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>

              {errors.answers?.message ? (
                <p className="mt-1 text-xs text-red-500">{errors.answers.message}</p>
              ) : null}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
