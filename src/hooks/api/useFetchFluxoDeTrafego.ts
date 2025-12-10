import { getFluxoDeTrafego } from "@/api/endpoints/graficos";
import { useQuery } from "@tanstack/react-query";

export const useFetchFluxoDeTrafego = (start: string, end: string) => {
  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["fluxoDeTrafego", start, end],
    queryFn: () => getFluxoDeTrafego(start, end),
    refetchOnWindowFocus: false,
  });
  return {
    fluxoDeTrafego: data || [],
    totalPages: data?.last_page || 0,
    isFetching,
    isError,
    error: error as any,
  };
};
