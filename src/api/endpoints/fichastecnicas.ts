import { request } from "../config";

export const createFichas = async (values: any) => {
  await request({
    endpoint: `dishes`,
    method: "POST",
    data: {
      ...values,
    },
  });
};

export const getFichas = async (page: number) => {
  return await request({
    endpoint: `dishes?page=${page}`,
    method: "GET",
  });
};

export const updateFichas = async (values: any) => {
  await request({
    endpoint: `dishes/${values.id}`,
    method: "PUT",
    data: { ...values },
  });
};

export const deleteFichas = async (id: number) => {
  return await request({
    endpoint: `dishes/${id}`,
    method: "DELETE",
  });
};
