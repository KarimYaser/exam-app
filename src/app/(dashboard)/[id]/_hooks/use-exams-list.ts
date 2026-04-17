import { useQuery } from "@tanstack/react-query";
import { getExams } from "../_actions/exams.actions";

export default function useExamsList(diplomaId: string) {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["exams", "list", diplomaId], // Fixed: Use proper key with diplomaId
    queryFn: async () => {
      const response = await getExams(diplomaId);
      // console.log("[useExamsList] Response:", response);
      return response;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  if (error) {
    console.error("[useExamsList] Query error:", error);
  }

  return { data, error, isLoading, isError };
}
