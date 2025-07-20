import api from "@/api/api";
import { BaseAPI } from "@/api/BaseApi";
import { QueryParams } from "@/services/HTTPTransport";

class UserApi extends BaseAPI {
  update(data: QueryParams): Promise<unknown> {
    return api.put(`${BaseAPI.BASE_URL}/user/profile`, { data });
  }
  changeAvatar(data: FormData): Promise<unknown> {
    return api.put(`${BaseAPI.BASE_URL}/user/profile/avatar`, {
      headers: {
        accept: "application/json",
      },
      data: data,
    });
  }
  changePassword(data: QueryParams): Promise<unknown> {
    return api.put(`${BaseAPI.BASE_URL}/user/password`, { data });
  }
  searchUser(data: QueryParams): Promise<unknown> {
    return api.post(`${BaseAPI.BASE_URL}/user/search`, { data });
  }
}

export const userApi = new UserApi();
