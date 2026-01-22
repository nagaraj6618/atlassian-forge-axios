export class ForgeAxiosError extends Error {
  response: any;

  constructor(message: string, response: any) {
    super(message);
    this.name = "ForgeAxiosError";
    this.response = response;
  }
}
