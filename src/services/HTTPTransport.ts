enum METHODS {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

type HTTPMethod = <R = unknown>(
  url: string,
  options?: Partial<RequestOptions<QueryParams>>
) => Promise<R>;

export type QueryParams = Record<string, string | number | boolean>;

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

  get: HTTPMethod = this.createMethod(METHODS.GET);
  post: HTTPMethod = this.createMethod(METHODS.POST);
  put: HTTPMethod = this.createMethod(METHODS.PUT);
  delete: HTTPMethod = this.createMethod(METHODS.DELETE);

  setUnauthorizedHandler(handler: () => void) {
    this.onUnauthorized = handler;
  }

  private queryStringify(
    data: Record<string, string | number | boolean>
  ): string {
    if (typeof data !== "object" || data === null) {
      throw new Error("Data must be object");
    }
    const keys = Object.keys(data);
    return keys.reduce((result, key, index) => {
      const value = data[key];
      const separator = index < keys.length - 1 ? "&" : "";
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(JSON.stringify(value));
      return `${result}${encodedKey}=${encodedValue}${separator}`;
    }, "?");
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
    options: RequestOptions<QueryParams> = {}
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

      if (isGet && data && typeof data === "object" && data !== null) {
        const query = this.queryStringify(data);
        xhr.open(method, `${url}${query}`);
      } else {
        xhr.open(method, url);
      }
      xhr.withCredentials = withCredentials ?? true;

      const isFormData = data instanceof FormData;

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
          xhr.send(data as FormData);
        } else {
          xhr.send(JSON.stringify(data));
        }
      }
    });
  }
}

export default HTTPTransport;
