import forgeAxios from "atlassian-forge-axios";

export const github = forgeAxios({
  target: "external",
  baseURL: "https://api.github.com",
});