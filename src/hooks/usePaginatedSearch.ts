import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchWithContext } from "@/utils/rateLimit";

interface PaginatedResponse<T> {
  results: T[];
  pagination: {
    hasMore: boolean;
    limit: number;
    offset: number;
  };
}

interface UsePaginatedSearchOptions<T> {
  query: string;
  endpoint: (query: string) => string;
  queryKey: string[];
  enabled?: boolean;
  perPage?: number;
  paramType?: "page" | "offset";
}

export function usePaginatedSearch<T>({
  query,
  endpoint,
  queryKey,
  enabled = true,
  perPage = 20,
  paramType = "page",
}: UsePaginatedSearchOptions<T>) {
  return useInfiniteQuery<PaginatedResponse<T>>({
    queryKey: [...queryKey, query],
    initialPageParam: paramType === "page" ? 1 : 0,
    queryFn: async ({ pageParam = paramType === "page" ? 1 : 0 }) => {
      let url = endpoint(query);
      if (paramType === "page") {
        url += `&page=${pageParam}&per_page=${perPage}`;
      } else {
        url += `&limit=${perPage}&offset=${pageParam}`;
      }
      const result = await fetchWithContext(url, {}, 3);
      if (result.error) throw result.error;
      return result.data;
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.pagination.hasMore) return undefined;
      return paramType === "page" ? pages.length + 1 : lastPage.pagination.offset + perPage;
    },
    enabled: enabled && query.length > 2,
    staleTime: 5 * 60 * 1000,
  });
}