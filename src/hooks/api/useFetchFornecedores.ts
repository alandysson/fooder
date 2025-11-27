import { getFornecedors } from "@/api/endpoints/fornecedores";
import { useQuery } from "@tanstack/react-query";

export const useFetchFornecedores = (page: number) => {
  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["fornecedores", page],
    queryFn: () => getFornecedors(page),
    refetchOnWindowFocus: false,
  });

  return {
    fornecedores: data?.data || [],
    totalPages: data?.last_page || 0,
    isFetching,
    isError,
    error: error as any,
  };
};
