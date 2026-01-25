import { route } from "@forge/api";
import { confluence } from "../clients/confluenceClient";

export async function confluenceGetSpaces() {
  // Confluence endpoints usually include /wiki
  const res = await confluence.get(route`/wiki/rest/api/space?limit=5`);
  return {
    size: res.data.size,
    results: res.data.results?.map((s: any) => ({
      id: s.id,
      key: s.key,
      name: s.name,
    })),
  };
}