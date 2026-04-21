import { Diploma } from "@/app/(dashboard)/_actions/diplomas.actions";

export type CreateExamQuestionItem = {
  id: string;
  text: string;
};

export type CreateExamPageProps = {
  diplomas: Diploma[];
  questions?: CreateExamQuestionItem[];
};
