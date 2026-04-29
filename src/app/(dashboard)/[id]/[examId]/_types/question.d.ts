// ============= QUESTION ENTITY =============
export interface Question {
  id: string;
  text: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";
  examId: string;
  answers: Answer[];
  correctAnswerId?: string;
  explanation?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  id: string;
  text: string;
  questionId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// ============= QUESTIONS LIST RESPONSE =============
export interface QuestionsListResponse {
  status: boolean;
  code: number;
  payload: {
    data: Question[];
    questions?: Question[];
    exam: {
      id: string;
      title: string;
      duration: number;
    };
  };
}

// ============= SUBMISSION ENTITY =============
export interface SubmissionAnswer {
  questionId: string;
  answerId?: string | null;
}

export interface SubmissionAnalyticsItem {
  questionId: string;
  questionText: string;
  isCorrect: boolean;
  selectedAnswer?: {
    id: string;
    text: string;
  };
  correctAnswer?: {
    id: string;
    text: string;
  };
}

export interface Submission {
  id: string;
  examId: string;
  userId: string;
  startedAt: string;
  submittedAt: string;
  score?: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  createdAt: string;
  updatedAt: string;
}

// ============= SUBMISSION DETAILS RESPONSE =============
export interface SubmissionDetailsResponse {
  status: boolean;
  code: number;
  payload: {
    submission?: Submission & {
      exam: {
        id: string;
        title: string;
        duration: number;
      };
      answers: SubmissionAnswer[];
      analytics: {
        correctPercentage: number;
        timeSpent: number;
        averageTimePerQuestion: number;
      };
    };
    analytics?: SubmissionAnalyticsItem[];
  };
}

// ============= SUBMIT EXAM REQUEST =============
export interface SubmitExamRequest {
  examId: string;
  answers: SubmissionAnswer[];
  startedAt: string;
}
