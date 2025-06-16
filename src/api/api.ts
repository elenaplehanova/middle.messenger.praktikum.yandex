import { App } from "@/components/App";
import HTTPTransport from "@/services/HTTPTransport";

const api = new HTTPTransport();

api.setUnauthorizedHandler(() => {
  App.getRouter().go("/sign-in");
});

export default api;
