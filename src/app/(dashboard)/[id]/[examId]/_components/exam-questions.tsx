"use client";

import useExamSession from "../_hooks/use-exam-session";
import ExamResults from "./exam-results";
import { ChevronLeft, ChevronRight, HelpCircle, RotateCcw } from "lucide-react";
import CircularTimer from "./circular-timer";
import useExamQuestions from "../_hooks/use-exam-questions";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ExamQuestionsProps {
  examId: string;
  diplomaId: string;
  diplomaName: string;
  examName: string;
}

export default function ExamQuestions({ examId, diplomaId, diplomaName, examName }: ExamQuestionsProps) {
  
  // State for retry mechanism
  const [retryCount, setRetryCount] = useState(0);
  const [hasTriedFinish, setHasTriedFinish] = useState(false);
  const router = useRouter();

  // Fetch questions using React Query hook - MUST be called before early returns
  const { data, isLoading: isQueryLoading, error: queryError } = useExamQuestions(examId);

  // Extract questions from the response payload
  const questions = data?.payload?.data || data?.payload?.questions || [];

  // Manage exam session state - MUST be called before early returns
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    selectedAnswer,
    handleSelectAnswer,
    handleNext,
    handlePrev,
    handleSubmit,
    isFirstQuestion,
    isSubmitting,
    isSubmitted,
    submissionId,
    submissionData,
    submitError,
    answers,
    handleRestart,
  } = useExamSession(examId, questions);

  // All hooks must be called above. Now we can safely use early returns.

  // Show results page after successful submission
  if (isSubmitted) {
    return (
      <ExamResults
        submissionId={submissionId}
        submissionData={submissionData}
        questions={questions}
        diplomaId={diplomaId}
        diplomaName={diplomaName}
        examName={examName}
        onRestart={handleRestart}
      />
    );
  }

  // Show loading state while fetching questions
  if (isQueryLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#155DFC] mb-4"></div>
        <p className="font-mono text-gray-500">Loading Exam Questions...</p>
      </div>
    );
  }

  // Show error state if query failed or no questions loaded
  if (queryError || !currentQuestion || questions.length === 0) {
    return (
      <div className="p-6 text-center text-red-500 bg-white h-full flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>
          {queryError
            ? "Failed to load questions. Please check your connection and try again."
            : "No questions found for this exam."}
        </p>
      </div>
    );
  }

  // Calculate progress percentage for progress bar
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Check if all questions have been answered
  const allQuestionsAnswered = Object.keys(answers).length === totalQuestions;
  const unansweredCount = totalQuestions - Object.keys(answers).length;

  // Retry handler for submission errors
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    handleSubmit();
  };

  const handleFinishClick = () => {
    if (!allQuestionsAnswered) {
      setHasTriedFinish(true);
      return;
    }

    setHasTriedFinish(false);
    handleSubmit();
  };

  return (
    <div className="w-full h-full min-h-0 flex flex-col bg-white overflow-y-auto">
      {/* 1. Breadcrumbs Navigation */}
      <div className="px-6 py-3 text-xs md:text-sm font-mono tracking-tight text-gray-400 ">
        <span className="hover:underline cursor-pointer" onClick={() => router.push("/")}>Diplomas</span>
        <span className="mx-2">/</span>
        <span className="hover:underline cursor-pointer" onClick={() => router.push(`/${diplomaId}?title=${encodeURIComponent(diplomaName)}`)}>
          {diplomaName}
        </span>
        <span className="mx-2">/</span>
        <span className="text-[#155DFC] font-semibold">{examName}</span>
      </div>

      {/* 2. Blue Action Banner with Question Title */}
      <div className="flex gap-1 w-full mt-6 px-4 md:px-8 max-w-7xl mx-auto">
        <button
          onClick={() =>
            router.push(`/${diplomaId}?title=${encodeURIComponent(diplomaName)}`)
          }
          className="bg-white border border-gray-200 p-4 shrink-0 hover:bg-gray-50 flex items-center justify-center transition-colors"
        >
          <ChevronLeft size={24} className="text-[#155DFC]" />
        </button>
        <div className="flex items-center gap-3 bg-[#155DFC] text-white px-6 py-4 flex-1 shadow-sm">
          <HelpCircle size={24} strokeWidth={2} />
          <h1 className="font-semibold font-mono md:text-xl sm:text-sm">
            {examName} Questions
          </h1>
        </div>
      </div>

      {/* 3. Progress and Timer Section */}
      <div className="px-4 py-4 max-w-7xl w-full mx-auto flex flex-col md:flex-row gap-3 items-start">
        <div className="flex-1 w-full">
          <div className="flex justify-between items-end mb-2">
            <span className="text-gray-900 font-bold font-mono text-xs md:text-sm line-clamp-1">
              {diplomaName} - {examName} Quiz
            </span>
            <span className="text-gray-400 font-bold font-mono text-[11px] md:text-xs shrink-0">
              Question <span className="text-[#155DFC]">{currentQuestionIndex + 1}</span> of{" "}
              {totalQuestions}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress bar */}
            <div className="flex-1 bg-blue-50 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#155DFC] h-full transition-all duration-700 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Timer component */}
            <div className="shrink-0">
              <CircularTimer durationMinutes={20} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Question & Answers Content Area */}
      <div className="flex-1 w-full bg-white px-4 pb-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          {/* Question text displayed in blue */}
          <h2 className="text-lg md:text-xl font-bold text-[#155DFC] font-mono leading-tight mb-2">
            {currentQuestion.text}
          </h2>

          {/* Answer options as interactive tiles */}
          <div className="flex flex-col gap-2">
            {currentQuestion.answers.map((answer) => {
              const isSelected = selectedAnswer === answer.id;
              return (
                <div
                  key={answer.id}
                  onClick={() =>
                    handleSelectAnswer(currentQuestion.id, answer.id)
                  }
                  className={`
                    flex items-center p-3 md:p-4 rounded-lg cursor-pointer transition-all duration-200 border-2
                    ${
                      isSelected
                        ? "bg-blue-50/20 border-[#155DFC]"
                        : "bg-[#F3F4F6] border-transparent hover:bg-gray-200"
                    }
                  `}
                >
                  {/* Radio button indicator */}
                  <div
                    className={`
                      w-4 h-4 rounded-full border-2 flex items-center justify-center mr-3 shrink-0
                      ${
                        isSelected
                          ? "border-[#155DFC]"
                          : "border-gray-300 bg-white"
                      }
                    `}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-[#155DFC]"></div>
                    )}
                  </div>
                  <span
                    className={`text-sm md:text-base font-mono tracking-tight text-gray-800 ${
                      isSelected ? "font-bold" : ""
                    }`}
                  >
                    {answer.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Show submission error if any */}
          {submitError && (
            <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded text-red-800 text-xs md:text-sm font-mono">
              <div className="font-bold text-red-900 mb-2">❌ Submission Error</div>
              <div className="mb-3">{submitError}</div>
              <div className="text-xs text-red-700 mb-4">
                Please check your connection and try submitting again. If the problem persists, contact support.
              </div>
              <button
                onClick={handleRetry}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400 transition text-xs font-semibold"
              >
                <RotateCcw size={14} />
                Retry Submission {retryCount > 0 && `(${retryCount})`}
              </button>
            </div>
          )}
          {/* Show unanswered questions warning on last question */}
          {currentQuestionIndex === totalQuestions - 1 && hasTriedFinish && !allQuestionsAnswered && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-300 rounded text-yellow-700 text-xs md:text-sm font-mono">
              ⚠️ You have {unansweredCount} unanswered {unansweredCount === 1 ? "question" : "questions"}. Please answer all questions before submitting.
            </div>
          )}
        </div>
      </div>

      {/* 5. Footer Navigation - Previous/Next Buttons */}
      <div className="px-4 py-4 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto flex gap-3">
          {/* Previous button */}
          <button
            onClick={handlePrev}
            disabled={isFirstQuestion}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded font-bold font-mono text-xs md:text-sm transition
              ${
                isFirstQuestion
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                  : "bg-gray-200 text-gray-500 hover:bg-gray-300"
              }`}
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          {/* Next/Finish button - switches to "Finish" on last question */}
          <button
            onClick={
              currentQuestionIndex === totalQuestions - 1
                ? handleFinishClick
                : handleNext
            }
            disabled={isSubmitting}
            title={
              currentQuestionIndex === totalQuestions - 1 && !allQuestionsAnswered
                ? `Please answer all questions (${unansweredCount} remaining)`
                : ""
            }
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded font-bold font-mono text-xs md:text-sm bg-[#155DFC] text-white hover:bg-blue-700 shadow-md transition disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {currentQuestionIndex === totalQuestions - 1
              ? isSubmitting
                ? "Processing..."
                : "Finish"
              : "Next"}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
