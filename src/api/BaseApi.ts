import { QueryParams } from "../services/HTTPTransport";

export abstract class BaseAPI {
  static readonly BASE_URL: string = "https://ya-praktikum.tech/api/v2";

  create(_data: QueryParams): Promise<unknown> {
    throw new Error("Not implemented");
  }

  request(): Promise<unknown> {
    throw new Error("Not implemented");
  }

  update(_data: QueryParams): Promise<unknown> {
    throw new Error("Not implemented");
  }

  delete(_data: QueryParams): Promise<unknown> {
    throw new Error("Not implemented");
  }
}
