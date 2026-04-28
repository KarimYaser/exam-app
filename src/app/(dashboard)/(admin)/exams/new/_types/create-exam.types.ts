import { Diploma } from "@/lib/types/diplomas";

export type CreateExamQuestionItem = {
  id: string;
  text: string;
};

export type CreateExamPageProps = {
  diplomas: Diploma[];
  questions?: CreateExamQuestionItem[];
};
