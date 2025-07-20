import api from "@/api/api";
import { BaseAPI } from "@/api/BaseApi";
import { QueryParams } from "@/services/HTTPTransport";

export class AuthApi extends BaseAPI {
  create(data: QueryParams): Promise<unknown> {
    return api.post(`${BaseAPI.BASE_URL}/auth/signup`, {
      data,
    });
  }

  signIn(data: QueryParams): Promise<unknown> {
    return api.post(`${BaseAPI.BASE_URL}/auth/signin`, {
      data,
    });
  }

  getUser() {
    return api.get(`${BaseAPI.BASE_URL}/auth/user`);
  }

  logout(): Promise<void> {
    return api.post(`${BaseAPI.BASE_URL}/auth/logout`);
  }
}

export const authApi = new AuthApi();
