import { AdminExam } from "../../../_types/admin-exam";
import { Diploma } from "@/lib/types/diplomas";

export type EditExamQuestionItem = {
  id: string;
  text: string;
};

export type EditExamPageProps = {
  exam: AdminExam;
  diplomas: Diploma[];
  questions: EditExamQuestionItem[];
};
