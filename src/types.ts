export type TargetType = "jira" | "confluence" | "external";
export type AsType = "user" | "app";

export interface ForgeAxiosConfig {
  target: TargetType;
  as?: AsType;
  baseURL?: string;
  headers?: Record<string, string>;
  timeLimit?: number;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  timeLimit?: number;
}

export interface ForgeAxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: RequestConfig & {
    method: string;
    url: any;
    target: TargetType;
  };
  request: null;
}

/**
 * Interceptors
 */
export type RequestInterceptor = (
  config: RequestConfig & { method: string; url: any }
) => RequestConfig & { method: string; url: any };

export type ResponseInterceptor<T = any> = (
  response: ForgeAxiosResponse<T>
) => ForgeAxiosResponse<T>;

export type ResponseErrorInterceptor = (error: any) => any;

export interface InterceptorManager {
  request: {
    use: (fn: RequestInterceptor) => void;
  };
  response: {
    use: (
      onSuccess: ResponseInterceptor,
      onError?: ResponseErrorInterceptor
    ) => void;
  };
}

export interface ForgeAxiosClient {
  interceptors: InterceptorManager;

  get: <T = any>(url: any, config?: RequestConfig) => Promise<ForgeAxiosResponse<T>>;
  delete: <T = any>(url: any, config?: RequestConfig) => Promise<ForgeAxiosResponse<T>>;
  post: <T = any>(url: any, data?: any, config?: RequestConfig) => Promise<ForgeAxiosResponse<T>>;
  put: <T = any>(url: any, data?: any, config?: RequestConfig) => Promise<ForgeAxiosResponse<T>>;
  patch: <T = any>(url: any, data?: any, config?: RequestConfig) => Promise<ForgeAxiosResponse<T>>;
}