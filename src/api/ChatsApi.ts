import { BaseAPI } from "@/api/BaseApi";
import api from "@/api/api";
import { QueryParams } from "@/services/HTTPTransport";

export class ChatsApi extends BaseAPI {
  getChats(): Promise<unknown> {
    return api.get(`${BaseAPI.BASE_URL}/chats`);
  }
  create(data: QueryParams): Promise<unknown> {
    return api.post(`${BaseAPI.BASE_URL}/chats`, { data });
  }
  delete(data: QueryParams): Promise<unknown> {
    return api.delete(`${BaseAPI.BASE_URL}/chats`, { data });
  }
  addUsersToChat(data: QueryParams): Promise<unknown> {
    return api.put(`${BaseAPI.BASE_URL}/chats/users`, { data });
  }
  getToken(id: number): Promise<unknown> {
    return api.post(`${BaseAPI.BASE_URL}/chats/token/${id}`);
  }
  getChatsUsers(id: number): Promise<unknown> {
    return api.get(`${BaseAPI.BASE_URL}/chats/${id}/users`);
  }
}

export const chatsApi = new ChatsApi();
