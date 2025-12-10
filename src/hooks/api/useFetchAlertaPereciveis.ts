import { getAlertaPereciveis } from "@/api/endpoints/graficos";
import { useQuery } from "@tanstack/react-query";

export const useFetchAlertaPereciveis = (hours: number) => {
  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["alertaPereciveis", hours],
    queryFn: () => getAlertaPereciveis(hours),
    refetchOnWindowFocus: false,
  });

  return {
    alertaPereciveis: data || [],
    totalPages: data?.last_page || 0,
    isFetching,
    isError,
    error: error as any,
  };
};
