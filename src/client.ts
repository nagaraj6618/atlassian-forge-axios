import {
  ForgeAxiosClient,
  ForgeAxiosConfig,
  RequestConfig,
  RequestInterceptor,
  ResponseInterceptor,
  ResponseErrorInterceptor,
  ForgeAxiosResponse,
} from "./types";
import { routeRequest } from "./request-router";
import { normalizeResponse } from "./response-normalizer";
import { ForgeAxiosError } from "./error";

function createInterceptorManager() {
  const requestInterceptors: RequestInterceptor[] = [];
  const responseInterceptors: Array<{
    onSuccess: ResponseInterceptor;
    onError?: ResponseErrorInterceptor;
  }> = [];

  return {
    requestInterceptors,
    responseInterceptors,
    interceptors: {
      request: {
        use: (fn: RequestInterceptor) => {
          requestInterceptors.push(fn);
        },
      },
      response: {
        use: (onSuccess: ResponseInterceptor, onError?: ResponseErrorInterceptor) => {
          responseInterceptors.push({ onSuccess, onError });
        },
      },
    },
  };
}

async function request<T = any>(
  method: string,
  url: any,
  data: any,
  config: RequestConfig,
  clientConfig: ForgeAxiosConfig,
  requestInterceptors: RequestInterceptor[],
  responseInterceptors: Array<{
    onSuccess: ResponseInterceptor;
    onError?: ResponseErrorInterceptor;
  }>
): Promise<ForgeAxiosResponse<T>> {
  // Apply request interceptors
  let finalConfig: RequestConfig & { method: string; url: any } = {
    ...(config || {}),
    method,
    url,
  };

  for (const interceptor of requestInterceptors) {
    finalConfig = interceptor(finalConfig);
  }

  const headers = {
    "Content-Type": "application/json",
    ...clientConfig.headers,
    ...finalConfig.headers,
  };

  const body = data !== undefined ? JSON.stringify(data) : undefined;

  const res = await routeRequest({
    method: finalConfig.method,
    url: finalConfig.url,
    body,
    headers,
    clientConfig,
  });

  const normalized = await normalizeResponse<T>(
    res,
    { headers: finalConfig.headers },
    { method: finalConfig.method, url: finalConfig.url, target: clientConfig.target }
  );

  if (!res.ok) {
    let err: any = new ForgeAxiosError("Request failed", {
      method: finalConfig.method,
      url: finalConfig.url,
      target: clientConfig.target,
      response: normalized,
    });

    // Apply response error interceptors
    for (const interceptor of responseInterceptors) {
      if (interceptor.onError) {
        err = interceptor.onError(err);
      }
    }

    throw err;
  }

  // Apply response success interceptors
  let finalResponse: any = normalized;

  for (const interceptor of responseInterceptors) {
    finalResponse = interceptor.onSuccess(finalResponse);
  }

  return finalResponse;
}

export function createClient(clientConfig: ForgeAxiosConfig): ForgeAxiosClient {
  const { requestInterceptors, responseInterceptors, interceptors } =
    createInterceptorManager();

  return {
    interceptors,

    get: <T = any>(url: any, config: RequestConfig = {}) =>
      request<T>(
        "GET",
        url,
        undefined,
        config,
        clientConfig,
        requestInterceptors,
        responseInterceptors
      ),

    delete: <T = any>(url: any, config: RequestConfig = {}) =>
      request<T>(
        "DELETE",
        url,
        undefined,
        config,
        clientConfig,
        requestInterceptors,
        responseInterceptors
      ),

    post: <T = any>(url: any, data?: any, config: RequestConfig = {}) =>
      request<T>(
        "POST",
        url,
        data,
        config,
        clientConfig,
        requestInterceptors,
        responseInterceptors
      ),

    put: <T = any>(url: any, data?: any, config: RequestConfig = {}) =>
      request<T>(
        "PUT",
        url,
        data,
        config,
        clientConfig,
        requestInterceptors,
        responseInterceptors
      ),

    patch: <T = any>(url: any, data?: any, config: RequestConfig = {}) =>
      request<T>(
        "PATCH",
        url,
        data,
        config,
        clientConfig,
        requestInterceptors,
        responseInterceptors
      ),
  };
}