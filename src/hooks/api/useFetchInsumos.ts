import { getInsumos } from "@/api/endpoints/insumos";
import { useQuery } from "@tanstack/react-query";

export const useFetchInsumos = () => {
  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["insumos"],
    queryFn: () => getInsumos(),
    refetchOnWindowFocus: false,
  });

  return {
    insumos: data?.data || [],
    // totalRecords: data?.paginator.totalRecords || 0,
    // totalPages: data?.paginator.totalPages || 0,
    // currentPage: data?.paginator.currentPage || 0,
    // isFetching,
    // isError,
    // error: error as any,
  };
};
