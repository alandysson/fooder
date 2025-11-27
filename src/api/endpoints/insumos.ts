import { request } from "../config";

export const createInsumo = async (values: any) => {
  await request({
    endpoint: `ingredients`,
    method: "POST",
    data: {
      ...values,
    },
  });
};

export const getInsumos = async (page: number) => {
  return await request({
    endpoint: `ingredients?page=${page}`,
    method: "GET",
  });
};

export const updateInsumo = async (values: any) => {
  await request({
    endpoint: `ingredients/${values.id}`,
    method: "PUT",
    data: { ...values },
  });
};

export const deleteInsumo = async (id: number) => {
  return await request({
    endpoint: `ingredients/${id}`,
    method: "DELETE",
  });
};
