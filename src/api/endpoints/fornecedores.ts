import { request } from "../config";

export const createFornecedor = async (values: any) => {
  await request({
    endpoint: `suppliers`,
    method: "POST",
    data: {
      ...values,
    },
  });
};

export const getFornecedors = async (page: number) => {
  return await request({
    endpoint: `suppliers?page=${page}`,
    method: "GET",
  });
};

export const updateFornecedor = async (values: any) => {
  await request({
    endpoint: `suppliers/${values.id}`,
    method: "PUT",
    data: { ...values },
  });
};

export const deleteFornecedor = async (id: number) => {
  return await request({
    endpoint: `suppliers/${id}`,
    method: "DELETE",
  });
};
