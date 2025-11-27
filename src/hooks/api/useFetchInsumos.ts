import { getInsumos } from "@/api/endpoints/insumos";
import { useQuery } from "@tanstack/react-query";

export const useFetchInsumos = (page: number) => {
  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["insumos", page],
    queryFn: () => getInsumos(page),
    refetchOnWindowFocus: false,
  });

  return {
    insumos: data?.data || [],
    totalPages: data?.last_page || 0,
    isFetching,
    isError,
    error: error as any,
  };
};
