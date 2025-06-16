import api from "@/api/api";
import { BaseAPI } from "@/api/BaseApi";
import { QueryParams } from "@/services/HTTPTransport";

class UserApi extends BaseAPI {
  update(data: QueryParams): Promise<unknown> {
    return api.put(`${BaseAPI.BASE_URL}/user/profile`, { data });
  }
}

export const userApi = new UserApi();
