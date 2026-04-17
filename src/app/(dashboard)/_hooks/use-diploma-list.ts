import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { DiplomasResponse } from "../_actions/diplomas.actions";
import { DIPLOMA_KEYS } from "@/app/api/diplomas/apis/diploma.options";
import { useSearchParams } from "next/navigation";
import { PAGINATION_LIMIT } from "@/lib/constants/api.constant";

export default function useDiplomaList() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || PAGINATION_LIMIT;

  return useInfiniteQuery({
    queryKey: DIPLOMA_KEYS.list(page, limit),
    queryFn: async ({ pageParam = page }) => {
      const response: DiplomasResponse = await fetch(
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
    getNextPageParam: (lastPage: DiplomasResponse) => {
      const meta = lastPage?.payload?.metadata || lastPage?.metadata || {};
      const currentPage = meta.page || 1;
      const totalPages = meta.totalPages || 1;
      //   console.log(meta);

      if (currentPage >= totalPages) return undefined;
      return currentPage + 1;
    },
  });
}
