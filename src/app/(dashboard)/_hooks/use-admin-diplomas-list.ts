import { useQuery } from "@tanstack/react-query";
import type { Diploma } from "../_actions/diplomas.actions";

type DiplomaPageResponse = {
  payload?: {
    data?: Diploma[];
    pagination?: {
      page?: number;
      totalPages?: number;
    };
    metadata?: {
      page?: number;
      totalPages?: number;
    };
  };
  data?: Diploma[];
  pagination?: {
    page?: number;
    totalPages?: number;
  };
  metadata?: {
    page?: number;
    totalPages?: number;
  };
};

function getPageItems(payload: DiplomaPageResponse): Diploma[] {
  return payload?.payload?.data ?? payload?.data ?? [];
}

function getTotalPages(payload: DiplomaPageResponse): number {
  return Number(
    payload?.payload?.pagination?.totalPages ??
      payload?.payload?.metadata?.totalPages ??
      payload?.pagination?.totalPages ??
      payload?.metadata?.totalPages ??
      1,
  );
}

export default function useAdminDiplomasList() {
  return useQuery({
    queryKey: ["admin-diplomas"],
    queryFn: async (): Promise<Diploma[]> => {
      const firstResponse = await fetch("/api/diplomas?page=1");
      if (!firstResponse.ok) {
        throw new Error("Failed to fetch diplomas");
      }

      const firstPage = (await firstResponse.json()) as DiplomaPageResponse;
      const totalPages = getTotalPages(firstPage);
      const firstItems = getPageItems(firstPage);

      if (totalPages <= 1) {
        return firstItems;
      }

      const extraPages = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, index) =>
          fetch(`/api/diplomas?page=${index + 2}`).then(async (response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch diplomas");
            }
            return (await response.json()) as DiplomaPageResponse;
          }),
        ),
      );

      const merged = [
        ...firstItems,
        ...extraPages.flatMap((page) => getPageItems(page)),
      ];

      return Array.from(new Map(merged.map((item) => [item.id, item])).values());
    },
    retry: 1,
  });
}
