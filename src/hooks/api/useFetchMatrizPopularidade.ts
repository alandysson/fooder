import { getMatrizPopularidade } from "@/api/endpoints/graficos";
import { useQuery } from "@tanstack/react-query";

export const useFetchMatrizPopularidade = (start: string, end: string) => {
  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["matrizPopularidade", start, end],
    queryFn: () => getMatrizPopularidade(start, end),
    refetchOnWindowFocus: false,
  });

  return {
    matrizPopularidade: data || [],
    totalPages: data?.last_page || 0,
    isFetching,
    isError,
    error: error as any,
  };
};
