import { getPontoDeEquilibrio } from "@/api/endpoints/graficos";
import { useQuery } from "@tanstack/react-query";

export const useFetchPontoDeEquilibrio = (date: string, fixed_cost: number) => {
  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["pontoDeEquilibrio", date, fixed_cost],
    queryFn: () => getPontoDeEquilibrio(date, fixed_cost),
    refetchOnWindowFocus: false,
  });

  return {
    pontoDeEquilibrio: data || [],
    totalPages: data?.last_page || 0,
    isFetching,
    isError,
    error: error as any,
  };
};
