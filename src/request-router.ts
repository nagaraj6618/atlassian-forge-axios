import api, { route } from "@forge/api";
import { ForgeAxiosConfig } from "./types";

interface RouterArgs {
  method: string;
  url: string;
  body?: any;
  headers?: Record<string, string>;
  clientConfig: ForgeAxiosConfig;
}

function getForgeApi(as: "user" | "app") {
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
    return forgeApi.requestJira(url as any, options);
  }

  if (target === "confluence") {
    return forgeApi.requestConfluence(url as any, options);
  }

  if (target === "external") {
    if (!baseURL) {
      throw new Error("baseURL is required for external APIs");
    }
    return api.fetch(`${baseURL}${url}`, options);
  }

  throw new Error("Invalid target");
}
