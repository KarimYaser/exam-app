export type AdminExam = {
  id: string;
  title: string;
  description: string;
  duration: number;
  image?: string | null;
  immutable?: boolean;
  createdAt?: string;
  updatedAt?: string;
  diploma?: {
    id: string;
    title: string;
  };
  _count?: {
    questions?: number;
  };
  questionsCount?: number;
};

export type AdminExamsResponse = {
  status: boolean;
  code: number;
  payload: {
    data: AdminExam[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message?: string;
};

export type AdminExamCardItem = {
  id: string;
  title: string;
  diplomaTitle: string;
  questionsCount: number;
  image?: string | null;
};
