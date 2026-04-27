import { useQuery } from "@tanstack/react-query";
import { getDiplomas, type Diploma } from "../_actions/diplomas.actions";

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
      const firstResponse = await getDiplomas(1, 100);

      const totalPages = getTotalPages(firstResponse);
      const firstItems = getPageItems(firstResponse);

      if (totalPages <= 1) {
        return firstItems;
      }

      const extraPages = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, index) =>
          getDiplomas(index + 2, 100),
        ),
      );

      const merged = [
        ...firstItems,
        ...extraPages.flatMap((page) => getPageItems(page)),
      ];

      return Array.from(
        new Map(merged.map((item) => [item.id, item])).values(),
      );
    },
  });
}
