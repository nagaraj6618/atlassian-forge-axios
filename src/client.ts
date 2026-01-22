import { ForgeAxiosConfig, RequestConfig } from "./types";
import { routeRequest } from "./request-router";
import { normalizeResponse } from "./response-normalizer";
import { ForgeAxiosError } from "./error";

async function request(
  method: string,
  url: string,
  data: any,
  config: RequestConfig,
  clientConfig: ForgeAxiosConfig
) {
  const headers = {
    "Content-Type": "application/json",
    ...clientConfig.headers,
    ...config?.headers,
  };

  const body =
    data !== undefined ? JSON.stringify(data) : undefined;

  const res = await routeRequest({
    method,
    url,
    body,
    headers,
    clientConfig,
  });

  const normalized = await normalizeResponse(res, config);

  if (!res.ok) {
    throw new ForgeAxiosError("Request failed", normalized);
  }

  return normalized;
}

export function createClient(clientConfig: ForgeAxiosConfig) {
  return {
    get: (url: string, config: RequestConfig = {}) =>
      request("GET", url, undefined, config, clientConfig),

    delete: (url: string, config: RequestConfig = {}) =>
      request("DELETE", url, undefined, config, clientConfig),

    post: (url: string, data?: any, config: RequestConfig = {}) =>
      request("POST", url, data, config, clientConfig),

    put: (url: string, data?: any, config: RequestConfig = {}) =>
      request("PUT", url, data, config, clientConfig),

    patch: (url: string, data?: any, config: RequestConfig = {}) =>
      request("PATCH", url, data, config, clientConfig),
  };
}
