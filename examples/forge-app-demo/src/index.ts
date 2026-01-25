import Resolver from "@forge/resolver";

import { jiraGetMyself } from "./resolvers/jira.getMyself";
import { jiraCommentCrud } from "./resolvers/jira.commentsCrud";
import { confluenceGetSpaces } from "./resolvers/confluence.getSpaces";
import { githubUser } from "./resolvers/external.githubUser";
import { interceptorsDemo } from "./resolvers/interceptors.demo";

const resolver = new Resolver();

resolver.define("jira.getMyself", async () => jiraGetMyself());
resolver.define("jira.commentCrud", async () => jiraCommentCrud());
resolver.define("confluence.getSpaces", async () => confluenceGetSpaces());
resolver.define("external.githubUser", async () => githubUser());
resolver.define("interceptors.demo", async () => interceptorsDemo());

export const handler = resolver.getDefinitions();