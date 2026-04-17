import { useState } from "react";
import { useSubmitExam } from "./use-submit-exam";
import { Question } from "../_schema/questions.schema";
import { SubmissionDetailsResponse } from "../_types/question";

/**
 * Hook to manage exam session state including question navigation,
 * answer tracking, and submission
 */
export default function useExamSession(examId: string, initialQuestions: Question[]) {
  // Track current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Store user answers as { questionId: answerId }
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Track when exam started
  const [startedAt, setStartedAt] = useState<string>(new Date().toISOString());

  // Track submission state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionData, setSubmissionData] =
    useState<SubmissionDetailsResponse | null>(null);

  // useMutation hook for submitting answers
  const { mutate: submitAnswersMutation, isPending: isSubmitting } = useSubmitExam();

  // Derived state
  const currentQuestion = initialQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === initialQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const totalQuestions = initialQuestions.length;

  /**
   * Record user's answer for a specific question
   */
  const handleSelectAnswer = (questionId: string, answerId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  /**
   * Navigate to next question
   */
  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  /**
   * Navigate to previous question
   */
  const handlePrev = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  /**
   * Submit exam answers to the server using mutation
   */
  const handleSubmit = async () => {
    setSubmitError(null);

    // Call mutation which triggers server action
    submitAnswersMutation(
      {
        examId,
        answers,
        startedAt,
      },
      {
        // Handle successful submission
        onSuccess: (response) => {
          setSubmissionData(response);
          // Store submission ID for fetching details later
          const subId = response?.payload?.submission?.id;
          if (!subId) {
            setSubmitError("Submission successful but no ID received. Please refresh the page.");
            return;
          }
          setSubmissionId(subId);
          setIsSubmitted(true);
        },
        // Handle submission error
        onError: (error) => {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to submit exam. Please try again.";
          console.error("Submission error:", error);
          setSubmitError(errorMessage);
        },
      }
    );
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSubmitError(null);
    setIsSubmitted(false);
    setSubmissionId(null);
    setSubmissionData(null);
    setStartedAt(new Date().toISOString());
  };

  return {
    // Question state
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    isFirstQuestion,
    isLastQuestion,

    // Answer state
    selectedAnswer: currentQuestion ? answers[currentQuestion.id] : undefined,
    answers,
    handleSelectAnswer,

    // Navigation
    handleNext,
    handlePrev,

    // Submission
    handleSubmit,
    isSubmitting,
    isSubmitted,
    submitError,
    submissionId,
    submissionData,
    startedAt,
    handleRestart,
  };
}
