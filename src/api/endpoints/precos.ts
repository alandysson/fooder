import { request } from "../config";

export const createPreco = async (values: any) => {
  await request({
    endpoint: `ingredient-prices`,
    method: "POST",
    data: {
      ...values,
    },
  });
};

export const getPrecos = async (page: number) => {
  return await request({
    endpoint: `ingredient-prices?page=${page}`,
    method: "GET",
  });
};

export const updatePreco = async (values: any) => {
  await request({
    endpoint: `ingredient-prices/${values.id}`,
    method: "PUT",
    data: { ...values },
  });
};

export const deletePreco = async (id: number) => {
  return await request({
    endpoint: `ingredient-prices/${id}`,
    method: "DELETE",
  });
};
