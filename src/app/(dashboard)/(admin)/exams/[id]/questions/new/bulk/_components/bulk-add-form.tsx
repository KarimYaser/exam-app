"use client";

import { useRef, useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, CheckCheck, Plus, Save, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  bulkCreateQuestions,
  type BulkQuestionInput,
} from "../_actions/bulk-questions.actions";
import {
  bulkQuestionsFormSchema,
  type BulkQuestionsFormValues,
} from "../_schema/bulk-form.schema";

/* ─── props ──────────────────────────────────────────────── */

type BulkAddFormProps = {
  examId: string;
  examTitle: string;
};

/* ═══════════════════════════════════════════════════════════ */

export default function BulkAddForm({ examId, examTitle }: BulkAddFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeIdx, setActiveIdx] = useState(0);
  const [newAnswerTexts, setNewAnswerTexts] = useState<string[]>([""]);
  const addInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* form setup ------------------------------------------------ */

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<BulkQuestionsFormValues>({
    resolver: zodResolver(bulkQuestionsFormSchema),
    defaultValues: {
      questions: [{ text: "", answers: [] }],
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const questions = watch("questions");
  const activeQ = questions[activeIdx];

  // Trigger validation when switching questions or when answers are updated
  useEffect(() => {
    trigger(`questions.${activeIdx}.answers`);
  }, [activeIdx, activeQ?.answers, trigger]);

  /* helpers ------------------------------------------------- */

  const addQuestion = () => {
    const next = fields.length;
    append({ text: "", answers: [] });
    setNewAnswerTexts((prev) => [...prev, ""]);
    setActiveIdx(next);
  };

  const removeQuestion = (idx: number) => {
    if (fields.length === 1) return;
    remove(idx);
    setNewAnswerTexts((prev) => prev.filter((_, i) => i !== idx));
    setActiveIdx((prev) => Math.min(prev, fields.length - 2));
  };

  /* answers ------------------------------------------------- */

  const addAnswer = (qIdx: number) => {
    const text = (newAnswerTexts[qIdx] ?? "").trim();
    if (!text) return;

    const currentAnswers = questions[qIdx]?.answers || [];
    const isFirstAnswer = currentAnswers.length === 0;

    setValue(
      `questions.${qIdx}.answers`,
      [
        ...currentAnswers,
        { text, isCorrect: isFirstAnswer },
      ],
      { shouldValidate: true, shouldDirty: true },
    );

    setNewAnswerTexts((prev) =>
      prev.map((v, i) => (i === qIdx ? "" : v)),
    );
    addInputRefs.current[qIdx]?.focus();
  };

  const removeAnswer = (qIdx: number, aIdx: number) => {
    const currentAnswers = questions[qIdx]?.answers || [];
    const next = currentAnswers.filter((_, i) => i !== aIdx);

    const hadCorrect = currentAnswers[aIdx]?.isCorrect;
    const fixed =
      hadCorrect && next.length > 0
        ? next.map((a, i) => (i === 0 ? { ...a, isCorrect: true } : a))
        : next;

    setValue(`questions.${qIdx}.answers`, fixed, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const setCorrectAnswer = (qIdx: number, aIdx: number) => {
    const currentAnswers = questions[qIdx]?.answers || [];
    setValue(
      `questions.${qIdx}.answers`,
      currentAnswers.map((a, i) => ({
        ...a,
        isCorrect: i === aIdx,
      })),
      { shouldValidate: true, shouldDirty: true },
    );
  };

  /* mutation ------------------------------------------------- */

  const { mutate: submitBulk, isPending } = useMutation({
    mutationFn: (values: BulkQuestionsFormValues) => {
      const payload: BulkQuestionInput[] = values.questions.map((q) => ({
        text: q.text.trim(),
        answers: q.answers,
      }));
      return bulkCreateQuestions(examId, { questions: payload });
    },
    onSuccess: (response) => {
      toast.success(
        response?.message ||
          `${questions.length} question(s) created successfully`,
        { position: "top-right" },
      );
      queryClient.invalidateQueries({ queryKey: ["admin-exams"] });
      router.push(`/exams/${examId}`);
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to create questions", {
        position: "top-right",
      });
    },
  });

  const onSubmit = (values: BulkQuestionsFormValues) => {
    submitBulk(values);
  };

  /* ─── render ─────────────────────────────────────────────── */

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#f4f5f7] font-mono text-[13px]">
      {/* breadcrumb */}
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
        <span className="font-semibold text-[#155DFC]">
          Create New Question
        </span>
      </div>

      {/* page header */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
        {/* bulk-mode badge */}
        <div className="inline-flex items-center gap-1.5 rounded-none bg-[#155DFC] px-3 py-1.5 text-xs font-semibold text-white">
          <Plus className="h-3.5 w-3.5" />
          Bulk Add Mode
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            className="rounded-none bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={() => router.push(`/exams/${examId}/questions/new`)}
            disabled={isPending}
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            type="submit"
            form="bulk-questions-form"
            className="rounded-none border-0 bg-[#00BC7D] text-white hover:bg-[#01a66f]"
            disabled={isPending}
          >
            <Save className="h-4 w-4" />
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* body */}
      <div className="space-y-5 px-4 py-6 sm:px-6">
        <form
          id="bulk-questions-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* ── Exam Info card ── */}
          <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
            <div className="bg-[#155DFC] px-4 py-2.5 text-sm font-semibold text-white">
              Exam Info
            </div>
            <div className="p-4">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Exam
              </label>
              <div className="flex h-10 items-center rounded border border-gray-200 bg-gray-50 px-3 text-sm text-gray-500">
                {examTitle}
              </div>
            </div>
          </div>

          {/* ── Questions card ── */}
          <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
            {/* card header */}
            <div className="bg-[#155DFC] px-4 py-2.5 text-sm font-semibold text-white">
              Questions
            </div>

            {/* question tabs */}
            <div className="flex items-center overflow-x-auto border-b border-gray-200 bg-white">
              {fields.map((_, idx) => (
                <div
                  key={idx}
                  className={`group relative flex shrink-0 cursor-pointer items-center gap-1.5 border-r border-gray-200 px-4 py-2.5 text-xs font-semibold transition-colors ${
                    idx === activeIdx
                      ? "bg-white text-[#155DFC]"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveIdx(idx)}
                >
                  <span>Q{idx + 1}</span>
                  {/* delete tab — only if more than 1 question */}
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeQuestion(idx);
                      }}
                      className="ml-0.5 rounded text-red-400 hover:text-red-600"
                      title="Remove question"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
              {/* add tab */}
              <button
                type="button"
                onClick={addQuestion}
                className="shrink-0 border-r border-gray-200 px-3 py-2.5 text-gray-400 hover:bg-gray-100 hover:text-[#155DFC]"
                title="Add question"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* active question editor */}
            {activeQ && (
              <div className="border border-[#155DFC]/30 m-4 rounded">
                {/* question text */}
                <div className="p-3">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Question Headline
                  </label>
                  <textarea
                    rows={3}
                    {...register(`questions.${activeIdx}.text`)}
                    className="w-full resize-none rounded border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-[#155DFC] focus:ring-2 focus:ring-blue-100"
                  />
                  {errors.questions?.[activeIdx]?.text?.message ? (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.questions[activeIdx]?.text?.message}
                    </p>
                  ) : null}
                </div>

                {/* answers sub-section */}
                <div className="border-t border-gray-200">
                  {/* answers header */}
                  <div className="flex items-center justify-between border-b border-gray-200 bg-gray-100 px-3 py-2">
                    <span className="text-xs font-semibold text-gray-600">
                      Body
                    </span>
                    <button
                      type="button"
                      onClick={() => addInputRefs.current[activeIdx]?.focus()}
                      className="inline-flex items-center gap-1 rounded bg-[#00BC7D] px-3 py-1 text-xs font-semibold text-white hover:bg-[#00a86e]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Answer
                    </button>
                  </div>

                  {/* hidden form fields for answers */}
                  {activeQ?.answers?.map((_, aIdx) => (
                    <input
                      key={`text-${activeIdx}-${aIdx}`}
                      type="hidden"
                      {...register(`questions.${activeIdx}.answers.${aIdx}.text`)}
                    />
                  ))}
                  {activeQ?.answers?.map((_, aIdx) => (
                    <input
                      key={`correct-${activeIdx}-${aIdx}`}
                      type="hidden"
                      {...register(
                        `questions.${activeIdx}.answers.${aIdx}.isCorrect`,
                      )}
                    />
                  ))}

                  {/* answer rows */}
                  <div className="divide-y divide-gray-100">
                    {(!activeQ.answers || activeQ.answers.length === 0) && (
                      <p className="px-4 py-5 text-center text-xs text-gray-400">
                        No answers yet — use the field below to add answers.
                      </p>
                    )}
                    {activeQ.answers?.map((ans, aIdx) => (
                      <div
                        key={aIdx}
                        className="flex items-center border-b border-gray-100 last:border-b-0"
                      >
                        {/* trash cell */}
                        <div className="flex w-10 shrink-0 items-center justify-center self-stretch border-r border-gray-200 bg-red-50">
                          <button
                            type="button"
                            onClick={() => removeAnswer(activeIdx, aIdx)}
                            className="p-1.5 text-red-500 hover:text-red-700"
                            title="Remove answer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* answer text */}
                        <span className="flex-1 truncate px-4 py-3 text-sm text-gray-800">
                          {ans.text}
                        </span>

                        {/* mark correct */}
                        <div className="flex shrink-0 items-center justify-end pr-3">
                          {ans.isCorrect ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#00BC7D]">
                              <CheckCheck className="h-3.5 w-3.5" />
                              Correct Answer
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                setCorrectAnswer(activeIdx, aIdx)
                              }
                              className="inline-flex items-center gap-1 rounded border border-gray-300 bg-gray-200 px-2.5 py-2 text-xs text-gray-800 hover:bg-gray-200"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Mark Correct
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {errors.questions?.[activeIdx]?.answers?.message ? (
                    <p className="border-t border-gray-100 px-4 py-2 text-xs text-red-500">
                      {errors.questions[activeIdx]?.answers?.message}
                    </p>
                  ) : null}

                  {/* add-answer input row */}
                  <div className="flex items-center border-t border-gray-200">
                    <input
                      ref={(el) => {
                        addInputRefs.current[activeIdx] = el;
                      }}
                      type="text"
                      value={newAnswerTexts[activeIdx] ?? ""}
                      onChange={(e) =>
                        setNewAnswerTexts((prev) =>
                          prev.map((v, i) =>
                            i === activeIdx ? e.target.value : v,
                          ),
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addAnswer(activeIdx);
                        }
                      }}
                      placeholder="Enter answer body"
                      className="h-11 flex-1 border-0 bg-white px-4 text-sm text-gray-800 outline-none placeholder:text-gray-400 ring-inset focus:ring-2 focus:ring-[#00BC7D]"
                    />
                    <button
                      type="button"
                      onClick={() => addAnswer(activeIdx)}
                      disabled={!(newAnswerTexts[activeIdx] ?? "").trim()}
                      className="inline-flex h-11 items-center gap-1.5 bg-[#00BC7D] px-5 text-sm font-semibold text-white hover:bg-[#00a86e] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
