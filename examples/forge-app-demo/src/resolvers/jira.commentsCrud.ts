import { route } from "@forge/api";
import { jira } from "../clients/jiraClient";

export async function jiraCommentCrud() {
  const issueKey = "TEST-1"; // change this to your issue key

  //  POST: Create comment
  const created = await jira.post(
    route`/rest/api/3/issue/${issueKey}/comment`,
    {
      body: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Created via atlassian-forge-axios ✅" }],
          },
        ],
      },
    }
  );

  const commentId = created.data.id;

  //  PUT: Update comment
  await jira.put(
    route`/rest/api/3/issue/${issueKey}/comment/${commentId}`,
    {
      body: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Updated via atlassian-forge-axios ✅" }],
          },
        ],
      },
    }
  );

  //  DELETE: Delete comment
  await jira.delete(route`/rest/api/3/issue/${issueKey}/comment/${commentId}`);

  return { success: true, commentId };
}