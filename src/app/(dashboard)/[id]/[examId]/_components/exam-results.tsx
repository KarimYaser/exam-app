import { BookOpenText, ChevronLeft, Compass, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useSubmissionDetails } from "../_hooks/use-submit-exam";
import {
  Answer,
  Question,
  SubmissionAnalyticsItem,
  SubmissionDetailsResponse,
} from "../_types/question";
import ResultsDonutChart from "./results-donut-chart";

export default function ExamResults({
  submissionId,
  submissionData,
  questions,
  diplomaId,
  diplomaName,
  examName,
  onRestart,
}: {
  submissionId: string | null;
  submissionData: SubmissionDetailsResponse | null;
  questions: Question[];
  diplomaId: string;
  diplomaName: string;
  examName: string;
  onRestart: () => void;
}) {
  const router = useRouter();
  const { data: submissionDetails } = useSubmissionDetails(submissionId);

  const resolved = submissionDetails || submissionData;
  if (!resolved?.payload) return null;

  const analytics: SubmissionAnalyticsItem[] = resolved.payload.analytics || [];
  const total = analytics.length || 1;
  const correct = analytics.filter((item) => item.isCorrect).length;
  const incorrect = total - correct;
  // make qustions be displayed in order
  const analyticsById = new Map(
    analytics.map((item) => [item.questionId, item]),
  );
  const orderedQuestions = [...questions].sort(
    (a, b) => a.order - b.order,
  );

  return (
    <div className="w-full h-full min-h-0 flex flex-col bg-gray-50 overflow-y-auto">
      <div className="w-full bg-white px-4 py-3 md:px-8 border-b border-gray-100 flex items-center text-sm font-mono tracking-tight">
        <span className="text-gray-400">Diplomas</span>
        <span className="text-gray-300 mx-2">/</span>
        <span className="text-[#155DFC]">{diplomaName}</span>
        <span className="text-gray-300 mx-2">/</span>
      </div>

      <div className="flex gap-1 w-full mt-6 px-4 md:px-8 max-w-7xl mx-auto">
        <button
          onClick={() =>
            router.push(
              `/${diplomaId}?title=${encodeURIComponent(diplomaName)}`,
            )
          }
          className="bg-white border border-gray-200 p-4 shrink-0 hover:bg-gray-50 flex items-center justify-center transition-colors"
        >
          <ChevronLeft size={24} className="text-[#155DFC]" />
        </button>
        <div className="flex items-center gap-3 bg-[#155DFC] text-white px-6 py-4 flex-1 shadow-sm">
          <BookOpenText size={24} strokeWidth={2} />
          <h1 className="font-semibold font-mono md:text-xl sm:text-sm">
            {examName} Questions
          </h1>
        </div>
      </div>

      <div className="px-4 md:px-8 py-6 max-w-7xl w-full mx-auto">
        <p className="text-3xl font-black text-[#155DFC] font-mono mb-4">
          Results:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
          <div className="bg-[#EFF6FF] border border-[#C7D1DF] p-6 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              <ResultsDonutChart correct={correct} incorrect={incorrect} />
            </div>

            <div className="mx-auto flex flex-col justify-start items-start gap-2 font-mono text-sm mt-4">
              <div className="flex items-center gap-2 text-gray-700 font-bold">
                <span className="w-3 h-3 bg-[#00BC7D] inline-block shrink-0" />
                Correct: {correct}
              </div>
              <div className="flex items-center gap-2 text-gray-700 font-bold">
                <span className="w-3 h-3 bg-[#EF4444] inline-block shrink-0" />
                Incorrect: {incorrect}
              </div>
            </div>
          </div>

          <div className="border border-dashed border-[#C7D1DF] bg-white p-4 space-y-4 max-h-130 overflow-y-auto">
            {orderedQuestions.map((question, idx) => {
              const item = analyticsById.get(question.id);
              const options: Answer[] = [...question.answers].sort(
                (a, b) => a.order - b.order,
              );
              const selectedAnswerId = item?.selectedAnswer?.id;
              const correctAnswerId =
                item?.correctAnswer?.id || question.correctAnswerId;
              const questionText = item?.questionText || question.text;
              const isUnanswered = !selectedAnswerId;

              const selectedAnswerText =
                item?.selectedAnswer?.text ||
                options.find((opt) => opt.id === selectedAnswerId)?.text ||
                "No answer selected";
              const correctAnswerText =
                item?.correctAnswer?.text ||
                options.find((opt) => opt.id === correctAnswerId)?.text ||
                "";

              return (
                <div
                  key={question.id || idx}
                  className={`space-y-2 rounded-lg border p-4 ${
                    isUnanswered
                      ? "bg-yellow-50/70 border-yellow-200"
                      : "bg-white border-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-3xl font-bold text-[#155DFC] font-mono">
                      {questionText}
                    </h3>
                    {isUnanswered && (
                      <span className="shrink-0 rounded-full border border-yellow-300 bg-yellow-100 px-2 py-1 text-[10px] font-bold font-mono uppercase text-yellow-800">
                        Unanswered
                      </span>
                    )}
                  </div>
                  {options.length === 0 ? (
                    <>
                      <div className="p-3 bg-red-50/70 border border-red-100 text-gray-700 font-mono text-lg flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-5 h-5 aspect-square shrink-0 rounded-full border-2 border-red-500">
                          <span className="w-4 h-4 rounded-full bg-red-600" />
                        </span>
                        {selectedAnswerText}
                      </div>

                      {correctAnswerText && (
                        <div className="p-3 bg-emerald-50/70 border border-emerald-100 text-gray-700 font-mono text-lg flex items-center gap-3">
                          <span className="inline-flex items-center justify-center w-5 h-5 aspect-square shrink-0 rounded-full border-2 border-emerald-500">
                            <span className="w-4 h-4 rounded-full bg-emerald-500" />
                          </span>
                          {correctAnswerText}
                        </div>
                      )}
                    </>
                  ) : (
                    options.map((option) => {
                      const isCorrectOption = option.id === correctAnswerId;
                      const isChosenWrong =
                        option.id === selectedAnswerId &&
                        selectedAnswerId !== correctAnswerId;

                      const rowClass = isCorrectOption
                        ? "bg-emerald-50/70 border-emerald-100"
                        : isChosenWrong
                          ? "bg-red-50/70 border-red-100"
                          : "bg-gray-50 border-gray-100";

                      const ringClass = isCorrectOption
                        ? "border-emerald-500"
                        : isChosenWrong
                          ? "border-red-500"
                          : "border-gray-300";

                      const dotClass = isCorrectOption
                        ? "bg-emerald-500"
                        : isChosenWrong
                          ? "bg-red-500"
                          : "bg-transparent";

                      return (
                        <div
                          key={option.id}
                          className={`p-3 border text-gray-700 font-mono text-lg flex items-center gap-3 ${rowClass}`}
                        >
                          <span
                            className={`inline-flex items-center justify-center w-5 h-5 aspect-square shrink-0 rounded-full border-2 ${ringClass}`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${dotClass}`}
                            />
                          </span>
                          {option.text}
                        </div>
                      );
                    })
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={onRestart}
            className="py-4 bg-gray-100 text-gray-600 font-mono font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition"
          >
            <RotateCcw size={16} />
            Restart
          </button>
          <button
            onClick={() =>
              router.push(
                `/${diplomaId}?title=${encodeURIComponent(diplomaName)}`,
              )
            }
            className="py-4 bg-[#155DFC] text-white font-mono font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
          >
            <Compass size={16} />
            Explore
          </button>
        </div>
      </div>
    </div>
  );
}
