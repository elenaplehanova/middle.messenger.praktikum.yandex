import { expect } from "chai";
import { Route } from "./Route.js";
import { Component } from "../Component.js";

class TestComponent extends Component {
  constructor(props?: Record<string, unknown>) {
    super("div", props);
  }

  render() {
    return "<div>Route Component</div>";
  }
}

describe("Route", () => {
  let route: Route;

  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
    route = new Route("/test", TestComponent, { rootQuery: "#root" });
  });

  it("should match the correct pathname", () => {
    expect(route.match("/test")).to.equal(true);
    expect(route.match("/other")).to.equal(false);
  });

  it("should return correct pathname", () => {
    expect(route.getPathname()).to.equal("/test");
  });

  it("should render component into root", () => {
    route.render();
    const root = document.querySelector("#root")!;
    expect(root.innerHTML).to.contain("Route Component");
  });

  it("should clear root on leave", () => {
    route.render();
    route.leave();
    const root = document.querySelector("#root")!;
    expect(root.innerHTML).to.equal("");
  });
});
