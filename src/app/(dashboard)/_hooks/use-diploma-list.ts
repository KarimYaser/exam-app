import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { DIPLOMA_KEYS } from "@/app/api/diplomas/apis/diploma.options";
import { useSearchParams } from "next/navigation";
import { PAGINATION_LIMIT } from "@/lib/constants/api.constant";
import { Diploma, DiplomasResponse, Pagination } from "@/lib/types/diplomas";

export default function useDiplomaList() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || PAGINATION_LIMIT;

  return useInfiniteQuery({
    queryKey: DIPLOMA_KEYS.list(page, limit),
    queryFn: async ({ pageParam = page }) => {
      const response: Response = await fetch(
        `/api/diplomas?page=${pageParam}&limit=${limit}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch diplomas");
      }
      const data: DiplomasResponse = await response.json();
      //   console.log(data);

      return data;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    getNextPageParam: (lastPage: any) => {
      const meta =
        lastPage?.payload?.metadata ||
        lastPage?.payload?.pagination ||
        lastPage?.metadata ||
        {};
      const currentPage = meta.page || 1;
      const totalPages = meta.totalPages || 1;
      console.log(meta);

      if (currentPage >= totalPages) return undefined;
      return currentPage + 1;
    },
  });
}
