import { getPrecos } from "@/api/endpoints/precos";
import { useQuery } from "@tanstack/react-query";

export const useFetchPrecos = () => {
  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["precos"],
    queryFn: () => getPrecos(),
    refetchOnWindowFocus: false,
  });

  return {
    precos: data?.data || [],
    // totalRecords: data?.paginator.totalRecords || 0,
    // totalPages: data?.paginator.totalPages || 0,
    // currentPage: data?.paginator.currentPage || 0,
    // isFetching,
    // isError,
    // error: error as any,
  };
};
