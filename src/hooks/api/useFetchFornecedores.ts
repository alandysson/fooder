import { getFornecedors } from "@/api/endpoints/fornecedores";
import { useQuery } from "@tanstack/react-query";

export const useFetchFornecedores = () => {
  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["fornecedores"],
    queryFn: () => getFornecedors(),
    refetchOnWindowFocus: false,
  });

  return {
    fornecedores: data?.data || [],
    // totalRecords: data?.paginator.totalRecords || 0,
    // totalPages: data?.paginator.totalPages || 0,
    // currentPage: data?.paginator.currentPage || 0,
    // isFetching,
    // isError,
    // error: error as any,
  };
};
