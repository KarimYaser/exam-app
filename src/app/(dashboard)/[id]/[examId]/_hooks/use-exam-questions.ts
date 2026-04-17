import { useQuery } from "@tanstack/react-query";
import { getExamQuestions } from "../_actions/questions.actions";

export default function useExamQuestions(examId: string) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["questions", examId],
    queryFn: async () => {
      const data = await getExamQuestions(examId);
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes cache for exam session
  });
  return { data, isLoading, isError, error };
}
