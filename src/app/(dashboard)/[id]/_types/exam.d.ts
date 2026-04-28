// ============= COMPONENT PROPS =============
export interface ExamsContentProps {
  diplomaId: string;
  diplomaTitle: string;
}

export interface ExamCardProps {
  exam: {
    id: string;
    title: string;
    description: string;
    duration?: number;
    _count: {
      questions: number;
    };
    questionsCount?: number;
    image?: string | null;
    diploma?: {
      id: string;
      title: string;
    };
  };
  diplomaId: string;
}

// ============= EXAM ENTITY =============
export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  diplomaId: string;
  image?: string | null;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
  diploma: {
    id: string;
    title: string;
  };
  _count: {
    questions: number;
  };
}

// ============= EXAMS LIST RESPONSE =============
export interface ExamsListResponse {
  status: boolean;
  code: number;
  payload: {
    data: Exam[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// ============= QUESTIONS ENTITY =============
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
  answerId: string;
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
    submission: Submission & {
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
  };
}

// ============= SUBMIT EXAM REQUEST =============
export interface SubmitExamRequest {
  examId: string;
  answers: {
    [questionId: string]: string;
  };
  startedAt: string;
}
