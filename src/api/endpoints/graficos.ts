import { request } from "../config";

export const getMatrizPopularidade = async (start: string, end: string) => {
  return await request({
    endpoint: `analytics/menu-matrix?start=${start}&end=${end}`,
    method: "GET",
  });
};

export const getMatrizPopularidadeCategoria = async (start: string, end: string) => {
  return await request({
    endpoint: `analytics/menu-matrix-by-category?start=${start}&end=${end}`,
    method: "GET",
  });
};

export const getFluxoDeTrafego = async (start: string, end: string) => {
  return await request({
    endpoint: `analytics/traffic-flow`,
    method: "GET",
    params: {
      start,
      end,
    },
  });
};

export const getPrecosFornecedor = async (ingredient_id: number) => {
  return await request({
    endpoint: `analytics/price-trends?ingredient_id=${ingredient_id}`,
    method: "GET",
  });
};

export const getPontoDeEquilibrio = async (date: string, fixed_cost: number) => {
  return await request({
    endpoint: `analytics/breakeven`,
    method: "GET",
    params: { date, fixed_cost },
  });
};

export const getAlertaPereciveis = async (hours: number) => {
  return await request({
    endpoint: `analytics/perishables-alerts`,
    method: "GET",
    params: { hours },
  });
};
