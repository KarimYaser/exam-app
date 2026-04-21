export interface BulkAnswerFormValue {
  text: string;
  isCorrect: boolean;
}

export interface BulkQuestionFormValue {
  text: string;
  answers: BulkAnswerFormValue[];
}

export interface BulkQuestionsFormValues {
  questions: BulkQuestionFormValue[];
}
