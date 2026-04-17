import { PAGINATION_LIMIT } from "@/lib/constants/api.constant";

export const DIPLOMA_KEYS = {
  list: (page: number = 1, limit: number = PAGINATION_LIMIT) =>
    ["diploma-list", page, limit] as const,
} as const;
