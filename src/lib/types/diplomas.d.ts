export interface Diploma {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DiplomasPayload {
  data: Diploma[];
  pagination: Pagination;
}

export interface DiplomasResponse {
  payload: DiplomasPayload;
}
