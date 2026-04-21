"use client";

import { Plus } from "lucide-react";
import type { CreateExamQuestionItem } from "../_types/create-exam.types";

type QuestionsPanelProps = {
  questions: CreateExamQuestionItem[];
};

export function QuestionsPanel({ questions }: QuestionsPanelProps) {
  return (
    <div className="mt-4 rounded border border-gray-200 bg-white">
      <div className="flex items-center justify-between bg-[#155DFC] px-3 py-2 text-sm font-semibold text-white">
        <span>Exam Questions</span>
        <button
          type="button"
          disabled
          className="inline-flex items-center gap-1 text-white/90"
          aria-disabled="true"
          title="Add questions after creating the exam"
        >
          <Plus className="h-4 w-4" />
          Add Questions
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-140 text-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="px-3 py-2 font-semibold">Title</th>
            </tr>
          </thead>
          <tbody>
            {questions.length === 0 ? (
              <tr>
                <td className="px-3 py-4 text-gray-500">No questions added yet.</td>
              </tr>
            ) : (
              questions.map((question) => (
                <tr key={question.id} className="border-t border-gray-100">
                  <td className="px-3 py-3 text-gray-800">{question.text}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
