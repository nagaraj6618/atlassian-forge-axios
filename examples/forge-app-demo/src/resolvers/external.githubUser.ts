import { github } from "../clients/externalClient";

export async function githubUser() {
  const res = await github.get("/users/octocat");
  return {
    login: res.data.login,
    id: res.data.id,
    url: res.data.html_url,
  };
}