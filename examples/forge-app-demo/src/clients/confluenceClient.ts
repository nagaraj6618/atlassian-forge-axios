import forgeAxios from "atlassian-forge-axios";

export const confluence = forgeAxios({
  target: "confluence",
  as: "user",
});