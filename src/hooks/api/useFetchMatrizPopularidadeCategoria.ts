import { getMatrizPopularidadeCategoria } from "@/api/endpoints/graficos";
import { useQuery } from "@tanstack/react-query";

export const useFetchMatrizPopularidadeCategoria = (start: string, end: string) => {
  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["matrizPopularidadeCategoria", start, end],
    queryFn: () => getMatrizPopularidadeCategoria(start, end),
    refetchOnWindowFocus: false,
  });

  return {
    matrizPopularidadeCategoria: data || [],
    totalPages: data?.last_page || 0,
    isFetching,
    isError,
    error: error as any,
  };
};
