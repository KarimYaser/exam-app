"use client";

import { MoreHorizontal, Plus } from "lucide-react";
import { EditExamQuestionItem } from "../_types/edit-exam.types";

type QuestionsPanelProps = {
  questions: EditExamQuestionItem[];
};

export default function QuestionsPanel({ questions }: QuestionsPanelProps) {
  return (
    <div className="rounded border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between bg-[#155DFC] px-3 py-2.5 text-xs font-medium text-white sm:px-4">
        <span className="text-sm font-semibold">Exam Questions</span>
        <button type="button" className="inline-flex items-center gap-1 text-xs hover:underline">
          <Plus className="h-3.5 w-3.5" />
          Add Questions
        </button>
      </div>

      <div className="grid grid-cols-[1fr_40px] items-center gap-3 border-b border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium uppercase tracking-wide text-gray-600 sm:px-4">
        <span>Title</span>
        <span className="text-right"> </span>
      </div>

      <div>
        {questions.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-gray-500">
            No questions found for this exam.
          </p>
        ) : (
          questions.map((question) => (
            <div
              key={question.id}
              className="grid grid-cols-[1fr_40px] items-center gap-3 border-b border-gray-100 px-3 py-2 text-sm last:border-b-0 sm:px-4"
            >
              <p className="truncate text-gray-800" title={question.text}>
                {question.text}
              </p>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
