import forgeAxios from "atlassian-forge-axios";

export const jira = forgeAxios({
  target: "jira",
  as: "user",
});