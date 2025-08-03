import { hello } from "./hello.js";
import { expect } from "chai";

describe("Simple test", () => {
  it("should pass", () => {
    expect(1 + 1).to.equal(2);
  });
});

describe("Typescript + Babel usage suite", () => {
  it("should return string correctly", () => {
    expect(hello("mocha"), "Hello mocha");
  });
});
