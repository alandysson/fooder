import { getFichas } from "@/api/endpoints/fichastecnicas";
import { useQuery } from "@tanstack/react-query";

export const useFetchFichas = (page: number) => {
  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["fichas", page],
    queryFn: () => getFichas(page),
    refetchOnWindowFocus: false,
  });

  console.log(data);
  return {
    fichas: data?.data || [],
    totalPages: data?.last_page || 0,
    isFetching,
    isError,
    error: error as any,
  };
};
