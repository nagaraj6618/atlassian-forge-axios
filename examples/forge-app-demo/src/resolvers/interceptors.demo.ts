import { route } from "@forge/api";
import { jira } from "../clients/jiraClient";
import type {
  ForgeAxiosResponse,
  RequestConfig,
  ForgeAxiosError,
} from "atlassian-forge-axios";

type RequestInterceptorConfig = RequestConfig & { method: string; url: any };

export async function interceptorsDemo() {
  //  Request interceptor
  jira.interceptors.request.use((config: RequestInterceptorConfig) => {
    console.log("Request:", config.method, config.url);
    return config;
  });

  //  Response interceptor
  jira.interceptors.response.use((res: ForgeAxiosResponse<any>) => {
    console.log("Response:", res.status);
    return res;
  });

  // Error interceptor
  jira.interceptors.response.use(
    (res: ForgeAxiosResponse<any>) => res,
    (err: ForgeAxiosError) => {
      console.log("Error:", err.response?.status);
      return err; // keep same behavior (do not swallow error)
    }
  );

  const res = await jira.get<any>(route`/rest/api/3/myself`);

  return {
    name: res.data.displayName,
  };
}