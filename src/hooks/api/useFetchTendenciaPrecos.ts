import { getPrecosFornecedor } from "@/api/endpoints/graficos";
import { useQuery } from "@tanstack/react-query";

export const useFetchTendenciaPrecos = (ingredient_id: number) => {
  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["tendenciaPrecos", ingredient_id],
    queryFn: () => getPrecosFornecedor(ingredient_id),
    refetchOnWindowFocus: false,
  });
  return {
    tendenciaPrecos: data || [],
    totalPages: data?.last_page || 0,
    isFetching,
    isError,
    error: error as any,
  };
};
