export type TargetType = "jira" | "confluence" | "external";
export type AsType = "user" | "app";

export interface ForgeAxiosConfig {
  target: TargetType;
  as?: AsType;
  baseURL?: string;
  headers?: Record<string, string>;
}

export interface RequestConfig {
  headers?: Record<string, string>;
}

export interface ForgeAxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: RequestConfig;
  request: any;
}
