import HTTP from "modules/http";
import { BaseAPI } from "modules/http/base-api";

const chatAPIInstance = new HTTP("api/v1/chats");

class ChatAPI extends BaseAPI {
  create() {
    // Здесь уже не нужно писать полный путь /api/v1/chats/
    return chatAPIInstance.post("/", { title: "string" });
  }

  request() {
    // Здесь уже не нужно писать полный путь /api/v1/chats/
    return chatAPIInstance.get("/full");
  }
}
