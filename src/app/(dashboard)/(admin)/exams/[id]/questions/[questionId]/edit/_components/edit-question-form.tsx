"use client";

import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, CheckCheck, Plus, Save, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  updateQuestionById,
  type QuestionPayload,
  type UpdateQuestionInput,
} from "@/app/(dashboard)/(admin)/exams/[id]/questions/_actions/questions.actions";
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
  const [newAnswerText, setNewAnswerText] = useState("");
  const addInputRef = useRef<HTMLInputElement>(null);

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

  const handleAddAnswer = () => {
    const trimmed = newAnswerText.trim();
    if (!trimmed) return;
    append({ text: trimmed, isCorrect: answers.length === 0 });
    setNewAnswerText("");
    addInputRef.current?.focus();
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
        <span
          className="cursor-pointer text-gray-500 hover:underline"
          onClick={() => router.push("/exams")}
        >
          Exams
        </span>
        <span className="text-gray-300">/</span>
        <span
          className="cursor-pointer text-gray-500 hover:underline"
          onClick={() => router.push(`/exams/${examId}`)}
        >
          {examTitle}
        </span>
        <span className="text-gray-300">/</span>
        <span className="font-semibold text-[#155DFC]">Edit Question</span>
      </div>

      <div className="flex shrink-0 flex-col gap-3 border-b lg:justify-end md:justify-end border-gray-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 ">
          <Button
            type="button"
            variant="secondary"
            className="rounded-none bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={() =>
              router.push(`/exams/${examId}/questions/${question.id}`)
            }
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

      <div className="px-4 py-6 sm:px-6">
        <form
          id="edit-question-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
            <div className="bg-[#155DFC] px-4 py-2.5 text-sm font-semibold text-white">
              Question Information
            </div>

            <div className="space-y-4 p-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Exam
                </label>
                <div className="flex h-10 items-center rounded border border-gray-200 bg-gray-50 px-3 text-sm text-gray-500">
                  {examTitle}
                </div>
              </div>

              <div>
                <label
                  htmlFor="question-text"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Question Headline
                </label>
                <textarea
                  id="question-text"
                  rows={3}
                  {...register("text")}
                  className="w-full resize-none rounded border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-[#155DFC] focus:ring-2 focus:ring-blue-100"
                />
                {errors.text?.message ? (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.text.message}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between bg-[#155DFC] px-4 py-2.5">
              <span className="text-sm font-semibold text-white">
                Question Answers
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600">
              <span>Body</span>
              <button
                type="button"
                onClick={() => addInputRef.current?.focus()}
                className="inline-flex items-center gap-1 rounded bg-[#00BC7D] px-3 py-1 text-sm font-semibold text-white transition-colors hover:bg-[#00a86e]"
              >
                <Plus className="h-5 w-5" />
                Add Answer
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {fields.length === 0 && (
                <p className="px-4 py-6 text-center text-xs text-gray-400">
                  No answers yet. Use the field below to add answers.
                </p>
              )}
              {fields.map((field, index) => {
                const isCorrect = answers[index]?.isCorrect;
                return (
                  <div
                    key={field.id}
                    className="flex items-center border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex w-10 shrink-0 items-center justify-center self-stretch border-r border-gray-200 bg-red-50">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-1.5 text-red-500 hover:text-red-700"
                        title="Remove answer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex-1 px-4 py-2">
                      <input
                        type="text"
                        {...register(`answers.${index}.text`)}
                        placeholder={`Answer ${index + 1}`}
                        className="h-9 w-full rounded border border-gray-200 px-3 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-[#155DFC] focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <input
                      type="hidden"
                      {...register(`answers.${index}.isCorrect`)}
                    />

                    <div className="flex shrink-0 items-center justify-end pr-3">
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#00BC7D]">
                          <CheckCheck className="h-3.5 w-3.5" />
                          Correct Answer
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setCorrectAnswer(index)}
                          className="inline-flex items-center gap-1 rounded border border-gray-300 bg-gray-200 px-2.5 py-2 text-xs text-gray-800 hover:bg-gray-200"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Mark Correct
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {errors.answers?.message ? (
              <p className="border-t border-gray-100 px-4 py-2 text-xs text-red-500">
                {errors.answers.message}
              </p>
            ) : null}

            <div className="flex items-center border-t border-gray-200">
              <input
                ref={addInputRef}
                type="text"
                value={newAnswerText}
                onChange={(e) => setNewAnswerText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddAnswer();
                  }
                }}
                placeholder="Enter answer body"
                className="h-11 flex-1 border-0 bg-white px-4 text-sm text-gray-800 outline-none placeholder:text-gray-400 ring-inset focus:ring-2 focus:ring-[#00BC7D]"
              />
              <button
                type="button"
                onClick={handleAddAnswer}
                disabled={!newAnswerText.trim()}
                className="inline-flex h-11 items-center gap-1.5 bg-[#00BC7D] px-5 text-sm font-semibold text-white hover:bg-[#00a86e] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
