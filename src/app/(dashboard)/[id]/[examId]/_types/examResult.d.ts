// ============= EXAM RESULT ENTITY =============
export interface ExamResult {
  id: string;
  submissionId: string;
  examId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  percentage: number;
  passed: boolean;
  startedAt: string;
  submittedAt: string;
  timeSpent: number;
  averageTimePerQuestion: number;
  createdAt: string;
  updatedAt: string;
}

// ============= EXAM RESULT WITH DETAILS =============
export interface ExamResultWithDetails extends ExamResult {
  exam: {
    id: string;
    title: string;
    duration: number;
    description?: string;
  };
  answers: {
    questionId: string;
    answerId: string;
    isCorrect?: boolean;
    timeSpent?: number;
  }[];
  analytics: {
    correctPercentage: number;
    timeSpent: number;
    averageTimePerQuestion: number;
    categoryPerformance?: {
      category: string;
      correct: number;
      total: number;
      percentage: number;
    }[];
  };
}

// ============= EXAM RESULTS LIST RESPONSE =============
export interface ExamResultsListResponse {
  status: boolean;
  code: number;
  payload: {
    data: ExamResult[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// ============= EXAM RESULT DETAILS RESPONSE =============
export interface ExamResultDetailsResponse {
  status: boolean;
  code: number;
  payload: {
    result: ExamResultWithDetails;
  };
}
