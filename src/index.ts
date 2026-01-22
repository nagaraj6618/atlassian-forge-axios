import { ForgeAxiosConfig } from "./types";
import { createClient } from "./client";

export default function forgeAxios(config: ForgeAxiosConfig) {
  return createClient(config);
}
