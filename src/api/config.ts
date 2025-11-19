import axios, { AxiosError, AxiosRequestConfig } from "axios";

export interface Error {
  title: string;
  status: number;
  detail: string;
}

interface RequestParams {
  method?: AxiosRequestConfig["method"];
  headers?: AxiosRequestConfig["headers"];
  endpoint: string;
  version?: string;
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  timeout?: AxiosRequestConfig["timeout"];
}

export const request = async ({
  method = "get",
  headers = {},
  endpoint,
  data,
  params = {},
  timeout = 7000,
}: RequestParams) => {
  const baseUrl = "menu-engineering-api-main-0bmer4.laravel.cloud";

  const enhancedParams = {
    ...params,
  };

  const config: AxiosRequestConfig = {
    method,
    baseURL: `https://${baseUrl}/api/${endpoint}`,
    data,
    params: enhancedParams,
    timeout: timeout,
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`,
      ...headers,
    },
  };

  let result;

  try {
    result = await axios(config);
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      throw "O servidor não respondeu a tempo, tente novamente mais tarde!";
    }
    if (error.response.status == 403) {
      if (error.response.config.method === "get") {
        throw error.response.data.errors[0].detail; // dispara mensagem para a tela de listagem
      }
    } else if (error.response.status == 404 && error.response.data.length === 0) {
      throw "Recurso não encontrado";
    }
    throw error;
  }

  return result.data;
};
