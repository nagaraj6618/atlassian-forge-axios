import { route } from "@forge/api";
import { jira } from "../clients/jiraClient";

export async function jiraGetMyself() {
  const res = await jira.get(route`/rest/api/3/myself`);
  return {
    accountId: res.data.accountId,
    displayName: res.data.displayName,
  };
}