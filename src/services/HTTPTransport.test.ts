import { expect, use } from "chai";
import sinonChai from "sinon-chai";
import type { SinonStub } from "sinon";
import { createSandbox } from "sinon";
import type { QueryParams, RequestOptions } from "./HTTPTransport.js";
import HTTPTransport, { METHODS } from "./HTTPTransport.js";
import type { Indexed } from "../utils/set.js";
import queryStringify from "../utils/queryStringify.js";

type ReturnValue = {
  responseText: string;
  status: number;
  url: string;
};

describe("HTTPTransport", () => {
  use(sinonChai);
  const sandbox = createSandbox();
  let http: HTTPTransport;
  let request: SinonStub;

  beforeEach(() => {
    http = new HTTPTransport();
    request = sandbox.stub(http, "request" as keyof HTTPTransport) as SinonStub<
      [string, Partial<RequestOptions<QueryParams | FormData>>?]
    >;
    request.callsFake(
      (
        url: string,
        options?: Partial<RequestOptions<QueryParams | FormData>>
      ): Promise<{ responseText: string; status: number; url: string }> => {
        const data = options?.data as Indexed;

        return Promise.resolve({
          responseText: JSON.stringify({}),
          status: 200,
          url: data ? `${url}?${queryStringify(data)}` : url,
        } as ReturnValue);
      }
    );
  });

  afterEach(() => {
    sandbox.restore();
  });
  describe("Method GET", () => {
    it("should be method GET for GET", async () => {
      await http.get("test");
      const [, options] = request.firstCall.args as [
        string,
        Partial<RequestOptions>?,
      ];
      expect(options?.method).to.equal(METHODS.GET);
    });
    it("should stringify query object for GET request where all parameters are strings", async () => {
      const data = { a: "1", b: "2" };
      await http.get("test", { data: data });
      const res = (await request.firstCall.returnValue) as ReturnValue;
      expect(res.url).to.equal("test?a=1&b=2");
    });
    it("should stringify query object for GET request where all parameters are numbers", async () => {
      const data = { a: 11, b: 22 };
      await http.get("test", { data: data });
      const res = (await request.firstCall.returnValue) as ReturnValue;
      expect(res.url).to.equal("test?a=11&b=22");
    });
    it("should stringify query object for GET request where all parameters are number and string", async () => {
      const data = { a: 1, b: "22" };
      await http.get("test", { data: data });
      const res = (await request.lastCall.returnValue) as ReturnValue;
      expect(res.url).to.equal("test?a=1&b=22");
    });
    it("should encode characters for query", async () => {
      const data = { a: "1+1", b: "2 2 " };
      await http.get("test", { data: data });
      const res = (await request.lastCall.returnValue) as ReturnValue;
      expect(res.url).to.equal("test?a=1%2B1&b=2%202%20");
    });
    it("should not append ? if GET request has no data", async () => {
      await http.get("test");
      const res = (await request.lastCall.returnValue) as ReturnValue;
      expect(res.url).to.equal("test");
    });
  });

  describe("Method POST", () => {
    it("should be method POST for POST", async () => {
      await http.post("test");
      const [, options] = request.firstCall.args as [
        string,
        Partial<RequestOptions>?,
      ];
      expect(options?.method).to.equal(METHODS.POST);
    });
    it("should send JSON body for POST request", async () => {
      const data = { a: 1, b: "text" };
      await http.post("test", { data });
      const [, options] = request.lastCall.args as [
        string,
        Partial<RequestOptions>?,
      ];
      expect(options?.data).to.deep.equal({ a: 1, b: "text" });
    });
    it("should not set Content-Type header explicitly if data is FormData", async () => {
      const formData = new FormData();
      formData.append("field", "value");
      await http.post("test", { data: formData });
      const [, options] = request.lastCall.args as [
        string,
        Partial<RequestOptions>?,
      ];
      const headers = options?.headers || {};
      expect(Object.keys(headers)).to.not.include("Content-Type");
    });
  });
});
