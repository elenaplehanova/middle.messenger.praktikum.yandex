type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

type RequestOptions = {
  headers?: Record<string, string>;
  method?: HTTPMethod;
  data?: Record<string, unknown>;
  timeout?: number;
};

export class HTTPTransport {
  private METHODS: Record<HTTPMethod, HTTPMethod> = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
  };

  private queryStringify(data: Record<string, unknown>): string {
    if (typeof data !== "object" || data === null) {
      throw new Error("Data must be object");
    }

    const keys = Object.keys(data);
    return keys.reduce((result, key, index) => {
      const value = data[key];
      const separator = index < keys.length - 1 ? "&" : "";
      return `${result}${key}=${value}${separator}`;
    }, "?");
  }

  public get(
    url: string,
    options: Omit<RequestOptions, "method"> = {}
  ): Promise<XMLHttpRequest> {
    return this.request(
      url,
      { ...options, method: this.METHODS.GET },
      options.timeout
    );
  }

  public post(
    url: string,
    options: Omit<RequestOptions, "method"> = {}
  ): Promise<XMLHttpRequest> {
    return this.request(
      url,
      { ...options, method: this.METHODS.POST },
      options.timeout
    );
  }

  public put(
    url: string,
    options: Omit<RequestOptions, "method"> = {}
  ): Promise<XMLHttpRequest> {
    return this.request(
      url,
      { ...options, method: this.METHODS.PUT },
      options.timeout
    );
  }

  public delete(
    url: string,
    options: Omit<RequestOptions, "method"> = {}
  ): Promise<XMLHttpRequest> {
    return this.request(
      url,
      { ...options, method: this.METHODS.DELETE },
      options.timeout
    );
  }

  private request(
    url: string,
    options: RequestOptions = {},
    timeout: number = 5000
  ): Promise<XMLHttpRequest> {
    const { headers = {}, method, data } = options;

    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new Error("No method"));
        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === this.METHODS.GET;

      if (isGet && data && typeof data === "object" && data !== null) {
        const query = this.queryStringify(data);
        xhr.open(method, `${url}${query}`);
      } else {
        xhr.open(method, url);
      }

      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = () => resolve(xhr);
      xhr.onabort = () => reject(new Error("Request aborted"));
      xhr.onerror = () => reject(new Error("Request failed"));
      xhr.ontimeout = () => reject(new Error("Request timeout"));

      xhr.timeout = timeout;

      if (isGet || !data) {
        xhr.send();
      } else {
        xhr.send(JSON.stringify(data));
      }
    });
  }
}

export default HTTPTransport;
