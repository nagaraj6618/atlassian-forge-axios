# atlassian-forge-axios

> Axios-like HTTP client for **Atlassian Forge**, built on top of `@forge/api`

`atlassian-forge-axios` provides a familiar **Axios-style API** (`get`, `post`, `put`, `patch`, `delete`) for Forge apps, while respecting Forge’s security model.

It removes repetitive boilerplate like manual `fetch`, `res.json()`, and error handling — while keeping Forge-safe behavior.

---

## ✨ Features

* ✅ Axios-like API (`get`, `post`, `put`, `patch`, `delete`)
* ✅ Works with:

  * Jira REST APIs
  * Confluence REST APIs
  * External APIs (`api.fetch`)
* ✅ Automatic JSON parsing
* ✅ Axios-style error handling
* ✅ TypeScript-first
* ✅ Zero runtime dependencies
* ✅ Forge-runtime compatible

---

## 📦 Installation

```bash
npm install atlassian-forge-axios
```

> ⚠️ This package works **only inside Atlassian Forge apps**

---

## 🔴 Important Forge Limitation (READ THIS)

### Why do I still need `route` for Jira / Confluence?

Forge requires **Jira and Confluence API URLs** to be wrapped with `route` **at the call site**.

This is **not a limitation of this library**, but a **Forge security requirement**.

❌ You cannot fully hide `route` inside a dependency.
✅ This library still simplifies request handling, responses, and errors.

### Rule Summary

| Target          | `route` Required |
| --------------- | ---------------- |
| Jira APIs       | ✅ Yes            |
| Confluence APIs | ✅ Yes            |
| External APIs   | ❌ No             |

---

## 🚀 Usage


### 1 Jira API Example (with `route`)

```ts
import Resolver from "@forge/resolver";
import { route } from "@forge/api";
import forgeAxios from "atlassian-forge-axios";

const resolver = new Resolver();

const jira = forgeAxios({
  target: "jira",
  as: "user",
});

resolver.define("getMyself", async () => {
  const res = await jira.get(route`/rest/api/3/myself`);
  return {
    name: res.data.displayName,
  };
});

export const handler = resolver.getDefinitions();
```

---

### 2 Jira POST / PUT / DELETE Example

```ts
resolver.define("commentCrud", async () => {
  const issueKey = "TEST-1";

  // POST – create comment
  const created = await jira.post(
    route`/rest/api/3/issue/${issueKey}/comment`,
    {
      body: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Created via atlassian-forge-axios" }],
          },
        ],
      },
    }
  );

  const commentId = created.data.id;

  // PUT – update comment
  await jira.put(
    route`/rest/api/3/issue/${issueKey}/comment/${commentId}`,
    {
      body: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Updated via atlassian-forge-axios" }],
          },
        ],
      },
    }
  );

  // DELETE – delete comment
  await jira.delete(
    route`/rest/api/3/issue/${issueKey}/comment/${commentId}`
  );

  return { success: true };
});
```

---

### 3 External API Example (NO `route` needed)

```ts
const external = forgeAxios({
  target: "external",
  baseURL: "https://api.github.com",
});

resolver.define("githubUser", async () => {
  const res = await external.get("/users/octocat");
  return {
    login: res.data.login,
    id: res.data.id,
  };
});
```

---

## 🔧 Client Configuration

```ts
forgeAxios({
  target: "jira" | "confluence" | "external",
  as?: "user" | "app",        // default: "user"
  baseURL?: string,           // required for external APIs
  headers?: Record<string, string>,
});
```

---

## 📡 Supported Methods

```ts
client.get(url, config?)
client.post(url, data?, config?)
client.put(url, data?, config?)
client.patch(url, data?, config?)
client.delete(url, config?)
```

---

## 📦 Response Format (Axios-like)

```ts
{
  data: any,
  status: number,
  statusText: string,
  headers: object,
  config: object,
  request: null
}
```

---

## ❌ Error Handling

```ts
try {
  await jira.get(route`/rest/api/3/issue/INVALID`);
} catch (err: any) {
  console.log(err.response.status);
  console.log(err.response.data);
}
```

---

## ⚠️ Forge Runtime Requirement

`atlassian-forge-axios` relies on `@forge/api`, which is **provided by the Forge runtime**.

You **do not need to install `@forge/api` manually**.

---

## 🗺️ Roadmap

### v1.0.1 (current)

* README clarification about `route`
* Stable Jira / Confluence / External support



## 🤝 Contributing

Contributions are welcome!

* Issues for bugs or feature requests
* PRs with clear explanations
* Keep Forge runtime constraints in mind

---

## 📄 License

MIT License

