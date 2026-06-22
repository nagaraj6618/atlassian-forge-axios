# atlassian-forge-axios

> Axios-like HTTP client for **Atlassian Forge**, powered by `@forge/api`

`atlassian-forge-axios` helps Forge developers reduce repeated boilerplate when calling APIs using `@forge/api`.

✅ Write request logic once  
✅ Reuse across Jira / Confluence / External APIs  
✅ Keep responses and errors consistent  
✅ Improve readability and maintainability

# Architecture
<img width="738" height="671" alt="image" src="https://github.com/user-attachments/assets/5977fc44-7f9d-4511-8206-97408ca43a82" />


---

## ✨ Why this package?

While building Forge apps, API calls often include repeated code:

- checking status (`res.ok`)
- parsing body (`res.json()`)
- writing error handling again and again

This package provides an Axios-like interface:

```ts
const res = await client.get(route`/rest/api/3/myself`);
console.log(res.data);
````

---

## ✅ Features

* ✅ Axios-style API: `get / post / put / patch / delete`
* ✅ Supports:

  * Jira REST APIs (`requestJira`)
  * Confluence REST APIs (`requestConfluence`)
  * External APIs (`api.fetch`)
* ✅ Auto JSON parsing
* ✅ Consistent response shape
* ✅ Consistent error shape (`err.response`)
* ✅ **Interceptors** (request / response / error)
* ✅ **Timeout / timeLimit** support (v1.2.1)
* ✅ TypeScript-first
* ✅ Open-source and lightweight

---

## 📦 Install

```bash
npm install atlassian-forge-axios
```

> ⚠️ Works only inside Atlassian Forge apps

---

## 🔴 Important Forge Note (`route` is required)

Forge requires Jira & Confluence URLs to be wrapped using `route` **at the call site**.

✅ Jira/Confluence:

```ts
client.get(route`/rest/api/3/myself`);
```

✅ External APIs (no route):

```ts
client.get("/users/octocat");
```

---

## 🎯 Quick Start

### Jira Client

```ts
import forgeAxios from "atlassian-forge-axios";
import { route } from "@forge/api";

const jira = forgeAxios({
  target: "jira",
  as: "user",
});

const res = await jira.get(route`/rest/api/3/myself`);
console.log(res.data);
```

---

## ⚙️ Creating Clients

### Jira Client

```ts
const jira = forgeAxios({ target: "jira", as: "user" });
```

### Confluence Client

```ts
const confluence = forgeAxios({ target: "confluence", as: "app" });
```

### External Client

```ts
const external = forgeAxios({
  target: "external",
  baseURL: "https://api.github.com",
});
```

---

## 📌 Supported Methods

```ts
client.get(url, config?)
client.post(url, data?, config?)
client.put(url, data?, config?)
client.patch(url, data?, config?)
client.delete(url, config?)
```

---

## ✅ Response Format

Every request returns:

```ts
{
  data,
  status,
  statusText,
  headers,
  config,
  request
}
```

Example:

```ts
const res = await jira.get(route`/rest/api/3/myself`);
console.log(res.status);
console.log(res.data);
```

---

## ❌ Error Handling

Errors follow Axios-style:

```ts
try {
  await jira.get(route`/rest/api/3/issue/INVALID`);
} catch (err: any) {
  console.log(err.message);
  console.log(err.response.status);
  console.log(err.response.data);
}
```

---

# ⏱️ Timeout / timeLimit (v1.2.1)

Forge apps should avoid waiting forever for an API response.
You can now define a **time limit in milliseconds**.

## ✅ Client-level default timeout

```ts
const jira = forgeAxios({
  target: "jira",
  as: "user",
  timeLimit: 5000, // 5 seconds
});
```

## ✅ Per-request timeout override

```ts
const res = await jira.get(route`/rest/api/3/myself`, {
  timeLimit: 2000, // 2 seconds
});
```

> Note: Timeout will reject the request after the time limit is reached.
> In Forge runtime, the underlying request may still run in the background,
> but your function will stop waiting and continue execution safely.

---

# ✅ Examples (Real Forge Usage)

---

## ✅ Example 1: Jira GET (User Profile)

```ts
import { route } from "@forge/api";

const res = await jira.get(route`/rest/api/3/myself`);
console.log(res.data.displayName);
```

---

## ✅ Example 2: Jira Search Issues

```ts
import { route } from "@forge/api";

const res = await jira.get(route`/rest/api/3/search?maxResults=5`);
console.log(res.data.issues);
```

---

## ✅ Example 3: External API (GitHub)

```ts
const github = forgeAxios({
  target: "external",
  baseURL: "https://api.github.com",
});

const res = await github.get("/users/octocat");
console.log(res.data.login);
```

---

# ✅ Interceptors (v1.2.0)

Interceptors allow you to write logic once and apply it to all API calls.

---

## ✅ Request Interceptor (Logging + Headers)

```ts
jira.interceptors.request.use((config) => {
  console.log("➡️ Request:", config.method, config.url);

  return {
    ...config,
    headers: {
      ...config.headers,
      "X-Client": "atlassian-forge-axios",
    },
  };
});
```

---

## ✅ Response Interceptor (Logging)

```ts
jira.interceptors.response.use((res) => {
  console.log("✅ Response status:", res.status);
  return res;
});
```

---

## ✅ Error Interceptor (Central Error Logging)

```ts
jira.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log("❌ Request failed:", err.response?.status);
    return err;
  }
);
```

---

# 🧱 Recommended Project Structure (Forge App)

If you use this in a bigger Forge app, this structure stays clean:

```txt
src/
  api/
    jiraClient.ts
    confluenceClient.ts
    externalClient.ts
  resolvers/
    issueResolver.ts
    userResolver.ts
  index.ts
```

Example `jiraClient.ts`

```ts
import forgeAxios from "atlassian-forge-axios";

export const jira = forgeAxios({
  target: "jira",
  as: "user",
});
```

---

## Examples

Check `/examples/forge-app-demo` for working Forge resolver examples.

---

# 📌 Roadmap

### v1.2.1 

* Timeout / timeLimit support
* Better production stability

### Next

* Retry support (429/502/503)
* Advanced logging hooks
* More examples and templates

---

# 🤝 Contributing

PRs and issues are welcome 🙌
If you find bugs or want new features, open an issue with a minimal example.

---

# 📄 License

MIT License

