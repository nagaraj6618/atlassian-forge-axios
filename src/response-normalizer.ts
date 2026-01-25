import { ForgeAxiosResponse, RequestConfig, TargetType } from "./types";

export async function normalizeResponse<T = any>(
  res: any,
  config: RequestConfig,
  meta: { method: string; url: any; target: TargetType }
): Promise<ForgeAxiosResponse<T>> {
  let data: any = null;

  if (res.status !== 204) {
    const contentType = res.headers?.get?.("content-type") || "";
    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }
  }

  return {
    data,
    status: res.status,
    statusText: res.statusText,
    headers: Object.fromEntries(res.headers.entries()),
    config: {
      ...config,
      method: meta.method,
      url: meta.url,
      target: meta.target,
    },
    request: null,
  };
}