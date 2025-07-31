import queryStringify from "@/utils/queryStringify";

enum METHODS {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

type HTTPMethod = <R = unknown>(
  url: string,
  options?: Partial<RequestOptions<QueryParams | FormData>>
) => Promise<R>;

export type QueryParams = Record<
  string,
  string | number | boolean | (string | number)[]
>;

type RequestOptions<T = unknown> = {
  headers?: Record<string, string>;
  method?: METHODS;
  data?: T;
  timeout?: number;
  withCredentials?: boolean;
};

export class HTTPTransport {
  private defaultOptions: RequestOptions = {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 5000,
  };

  private onUnauthorized?: () => void;

  get = this.createMethod(METHODS.GET);
  post = this.createMethod(METHODS.POST);
  put = this.createMethod(METHODS.PUT);
  delete = this.createMethod(METHODS.DELETE);

  setUnauthorizedHandler(handler: () => void) {
    this.onUnauthorized = handler;
  }

  private async parseResponse<R>(xhr: XMLHttpRequest): Promise<R> {
    try {
      return (await JSON.parse(xhr.responseText)) as R;
    } catch {
      return xhr.responseText as unknown as R;
    }
  }

  private createMethod(method: METHODS): HTTPMethod {
    return async (url, options = {}) => {
      const response = await this.request(url, { ...options, method });
      return this.parseResponse(response);
    };
  }

  private request(
    url: string,
    options: RequestOptions<QueryParams | FormData> = {}
  ): Promise<XMLHttpRequest> {
    const mergedOptions: RequestOptions = {
      ...this.defaultOptions,
      ...options,
      headers: {
        ...this.defaultOptions.headers,
        ...options.headers,
      },
    };
    const {
      headers = {},
      method,
      data,
      timeout = 5000,
      withCredentials,
    } = mergedOptions;

    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new Error("No method"));
        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;

      const isFormData = data instanceof FormData;
      if (isGet && data && typeof data === "object" && !data && !isFormData) {
        const query = queryStringify(data);
        xhr.open(method, `${url}${query}`);
      } else {
        xhr.open(method, url);
      }
      xhr.withCredentials = withCredentials ?? true;

      if (!isFormData) {
        Object.keys(headers).forEach((key) => {
          xhr.setRequestHeader(key, headers[key]);
        });
      } else {
        Object.keys(headers).forEach((key) => {
          if (key.toLowerCase() !== "content-type") {
            xhr.setRequestHeader(key, headers[key]);
          }
        });
      }

      xhr.onload = () => {
        if (xhr.status === 401) {
          this.onUnauthorized?.();
          reject(new Error("Unauthorized (401)"));
          return;
        }
        resolve(xhr);
      };
      xhr.onabort = () => reject(new Error("Request aborted"));
      xhr.onerror = () => reject(new Error("Request failed"));
      xhr.ontimeout = () => reject(new Error("Request timeout"));

      xhr.timeout = timeout;

      if (isGet || !data) {
        xhr.send();
      } else {
        if (isFormData) {
          xhr.send(data);
        } else {
          xhr.send(JSON.stringify(data));
        }
      }
    });
  }
}

export default HTTPTransport;
