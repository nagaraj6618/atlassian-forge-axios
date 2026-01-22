import { ForgeAxiosResponse, RequestConfig } from "./types";

export async function normalizeResponse(
  res: Response,
  config: RequestConfig
): Promise<ForgeAxiosResponse> {
  let data: any = null;

  if (res.status !== 204) {
    const contentType = res.headers.get("content-type") || "";
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
    config,
    request: null,
  };
}
