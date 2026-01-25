import { TargetType } from "./types";

export class ForgeAxiosError extends Error {
  response: any;
  config: any;

  constructor(message: string, args: {
    method: string;
    url: any;
    target: TargetType;
    response: any;
  }) {
    super(message);
    this.name = "ForgeAxiosError";

    this.response = args.response;
    this.config = {
      method: args.method,
      url: args.url,
      target: args.target,
    };
  }
}