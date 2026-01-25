import api from "@forge/api";
import { ForgeAxiosConfig, AsType } from "./types";

interface RouterArgs {
  method: string;
  url: any; // Jira/Confluence expects route`...`
  body?: any;
  headers?: Record<string, string>;
  clientConfig: ForgeAxiosConfig;
}

function getForgeApi(as: AsType) {
  return as === "app" ? api.asApp() : api.asUser();
}

export async function routeRequest({
  method,
  url,
  body,
  headers,
  clientConfig,
}: RouterArgs): Promise<any> {
  const { target, as = "user", baseURL } = clientConfig;

  const options = {
    method,
    headers,
    body,
  };

  const forgeApi = getForgeApi(as);

  if (target === "jira") {
    return forgeApi.requestJira(url, options);
  }

  if (target === "confluence") {
    return forgeApi.requestConfluence(url, options);
  }

  if (target === "external") {
    if (!baseURL) {
      throw new Error("baseURL is required for external APIs");
    }
    return api.fetch(`${baseURL}${url}`, options);
  }

  throw new Error("Invalid target");
}