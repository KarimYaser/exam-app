"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExam, type CreateExamInput } from "../_actions/create-exam.actions";

export function useCreateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CreateExamInput) => createExam(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-exams"] });
    },
  });
}
