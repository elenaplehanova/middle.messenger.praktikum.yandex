import { expect, use } from "chai";
import { createSandbox } from "sinon";
import { Router } from "./Router.js";
import { Component } from "../Component.js";
import sinonChai from "sinon-chai";

describe("Router", () => {
  use(sinonChai);
  const sandbox = createSandbox();

  class TestComponent extends Component {
    constructor(props?: Record<string, unknown>) {
      super("div", props);
    }

    render() {
      return "<div>TestComponent</div>";
    }
  }

  let router: Router;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    router = new Router("#app");
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should return same Router instance (singleton)", () => {
    const anotherRouter = new Router("#app");
    expect(router).to.equal(anotherRouter);
  });

  it("should register route with use()", () => {
    router.use("/test", TestComponent);
    const route = router.getRoute("/test");
    expect(route?.getPathname()).to.equal("/test");
  });

  it("should return wildcard route if no match", () => {
    router.use("*", TestComponent);
    const route = router.getRoute("/not-found");
    expect(route?.getPathname()).to.equal("*");
  });

  it("should push new state and call _onRoute on go()", () => {
    router.use("/test", TestComponent);
    const spy = sandbox.spy(window.history, "pushState");

    const routeRouter = router as Router & {
      _onRoute: (pathname: string) => void;
    };
    const routeSpy = sandbox.spy(routeRouter, "_onRoute");

    router.go("/test");

    expect(spy.calledOnceWith({}, "", "/test")).to.equal(true);
    expect(routeSpy.calledOnceWith("/test")).to.equal(true);
  });

  it("should call history.back on back()", () => {
    const spy = sandbox.spy(window.history, "back");
    router.back();
    expect(spy.calledOnce).to.equal(true);
  });

  it("should call history.forward on forward()", () => {
    const spy = sandbox.spy(window.history, "forward");
    router.forward();
    expect(spy.calledOnce).to.equal(true);
  });
});
