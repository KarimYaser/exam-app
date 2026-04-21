"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, CheckCheck, Plus, Save, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  bulkCreateQuestions,
  type BulkQuestionInput,
} from "../_actions/bulk-questions.actions";

/* ─── types ──────────────────────────────────────────────── */

type Answer = { text: string; isCorrect: boolean };
type QuestionDraft = { text: string; answers: Answer[] };

const emptyQuestion = (): QuestionDraft => ({
  text: "",
  answers: [],
});

/* ─── props ──────────────────────────────────────────────── */

type BulkAddFormProps = {
  examId: string;
  examTitle: string;
};

/* ═══════════════════════════════════════════════════════════ */

export default function BulkAddForm({ examId, examTitle }: BulkAddFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  /** list of question drafts */
  const [questions, setQuestions] = useState<QuestionDraft[]>([emptyQuestion()]);
  /** index of the currently visible question tab */
  const [activeIdx, setActiveIdx] = useState(0);

  /** per-question "new answer" input refs */
  const addInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [newAnswerTexts, setNewAnswerTexts] = useState<string[]>([""]);

  /* helpers ------------------------------------------------- */

  const activeQ = questions[activeIdx]!;

  const updateQuestion = (idx: number, patch: Partial<QuestionDraft>) =>
    setQuestions((prev) =>
      prev.map((q, i) => (i === idx ? { ...q, ...patch } : q)),
    );

  const addQuestion = () => {
    const next = questions.length;
    setQuestions((prev) => [...prev, emptyQuestion()]);
    setNewAnswerTexts((prev) => [...prev, ""]);
    setActiveIdx(next);
  };

  const removeQuestion = (idx: number) => {
    if (questions.length === 1) return; // always keep at least one
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
    setNewAnswerTexts((prev) => prev.filter((_, i) => i !== idx));
    setActiveIdx((prev) => Math.min(prev, questions.length - 2));
  };

  /* answers ------------------------------------------------- */

  const addAnswer = (qIdx: number) => {
    const text = (newAnswerTexts[qIdx] ?? "").trim();
    if (!text) return;
    updateQuestion(qIdx, {
      answers: [
        ...questions[qIdx]!.answers,
        { text, isCorrect: questions[qIdx]!.answers.length === 0 },
      ],
    });
    setNewAnswerTexts((prev) =>
      prev.map((v, i) => (i === qIdx ? "" : v)),
    );
    addInputRefs.current[qIdx]?.focus();
  };

  const removeAnswer = (qIdx: number, aIdx: number) => {
    const next = questions[qIdx]!.answers.filter((_, i) => i !== aIdx);
    // if the removed answer was correct, promote index 0
    const hadCorrect = questions[qIdx]!.answers[aIdx]?.isCorrect;
    const fixed = hadCorrect && next.length > 0
      ? next.map((a, i) => (i === 0 ? { ...a, isCorrect: true } : a))
      : next;
    updateQuestion(qIdx, { answers: fixed });
  };

  const setCorrect = (qIdx: number, aIdx: number) => {
    updateQuestion(qIdx, {
      answers: questions[qIdx]!.answers.map((a, i) => ({
        ...a,
        isCorrect: i === aIdx,
      })),
    });
  };

  /* validation ---------------------------------------------- */

  const validate = (): string | null => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]!;
      if (!q.text.trim()) return `Question ${i + 1} has no text.`;
      if (q.answers.length < 2) return `Question ${i + 1} needs at least 2 answers.`;
      if (!q.answers.some((a) => a.isCorrect))
        return `Question ${i + 1} has no correct answer selected.`;
    }
    return null;
  };

  /* mutation ------------------------------------------------- */

  const { mutate: submitBulk, isPending } = useMutation({
    mutationFn: () => {
      const payload: BulkQuestionInput[] = questions.map((q) => ({
        text: q.text.trim(),
        answers: q.answers,
      }));
      return bulkCreateQuestions(examId, { questions: payload });
    },
    onSuccess: (response) => {
      toast.success(
        response?.message || `${questions.length} question(s) created successfully`,
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

  const handleSave = () => {
    const err = validate();
    if (err) {
      toast.error(err, { position: "top-right" });
      return;
    }
    submitBulk();
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
        <span className="font-semibold text-[#155DFC]">Create New Question</span>
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
            type="button"
            className="rounded-none border-0 bg-[#00BC7D] text-white hover:bg-[#01a66f]"
            onClick={handleSave}
            disabled={isPending}
          >
            <Save className="h-4 w-4" />
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* body */}
      <div className="space-y-5 px-4 py-6 sm:px-6">
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
            {questions.map((_, idx) => (
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
                {questions.length > 1 && (
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
          <div className="border border-[#155DFC]/30 m-4 rounded">
            {/* question text */}
            <div className="p-3">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Question Headline
              </label>
              <textarea
                rows={3}
                value={activeQ.text}
                onChange={(e) =>
                  updateQuestion(activeIdx, { text: e.target.value })
                }
                className="w-full resize-none rounded border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-[#155DFC] focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* answers sub-section */}
            <div className="border-t border-gray-200">
              {/* answers header */}
              <div className="flex items-center justify-between border-b border-gray-200 bg-gray-100 px-3 py-2">
                <span className="text-xs font-semibold text-gray-600">Body</span>
                <button
                  type="button"
                  onClick={() => addInputRefs.current[activeIdx]?.focus()}
                  className="inline-flex items-center gap-1 rounded bg-[#00BC7D] px-3 py-1 text-xs font-semibold text-white hover:bg-[#00a86e]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Answer
                </button>
              </div>

              {/* answer rows */}
              <div className="divide-y divide-gray-100">
                {activeQ.answers.length === 0 && (
                  <p className="px-4 py-5 text-center text-xs text-gray-400">
                    No answers yet — use the field below to add answers.
                  </p>
                )}
                {activeQ.answers.map((ans, aIdx) => (
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
                          onClick={() => setCorrect(activeIdx, aIdx)}
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
        </div>
      </div>
    </div>
  );
}
