import { expect, use } from "chai";
import Sinon, { createSandbox } from "sinon";
import { Component } from "./Component.js";
import sinonChai from "sinon-chai";

interface TestComponentPrototype {
  componentDidMount: () => void;
  componentDidUpdate: (oldProps: unknown, newProps: unknown) => void;
  renderComponent: () => void;
  unbindElements: () => void;
  findElements: () => void;
  bindElements: () => void;
}

describe("Component", () => {
  use(sinonChai);
  const sandbox = createSandbox();

  class TestComponent extends Component<{ text?: string }> {
    render() {
      return `<div id="test">${this.props.text || "default"}</div>`;
    }
  }

  afterEach(() => {
    sandbox.restore();
  });

  describe("TestComponent", () => {
    it("render props", () => {
      const component = new TestComponent("div", { text: "test" });
      expect(component.element?.textContent).to.be.eq("test");
    });

    it("should update props with setProps", () => {
      const component = new TestComponent("div", { text: "old" });
      component.setProps({ text: "new" });
      expect(component.props.text).to.eq("new");
    });

    it("should show element", () => {
      const component = new TestComponent();
      const el = component.getContent();
      el!.style.display = "none";

      component.show();

      expect(el!.style.display).to.eq("flex");
    });

    it("should hide element", () => {
      const component = new TestComponent();
      const el = component.getContent();
      el!.style.display = "flex";

      component.hide();

      expect(el!.style.display).to.eq("none");
    });

    it("should validate input and show error", () => {
      const component = new TestComponent("div", {});

      const input = document.createElement("input");
      input.id = "email";
      input.value = "";

      const errorDiv = document.createElement("div");
      errorDiv.id = "email-error";
      component.getContent()?.appendChild(input);
      component.getContent()?.appendChild(errorDiv);

      const result = component.validateField(input, (val) => {
        if (!val) return { isValid: false, error: "Required" };
        return { isValid: true };
      });

      expect(result?.isValid).to.equal(false);
      expect(errorDiv.textContent).to.eq("Required");
    });

    describe("Lifecycle methods", () => {
      it("should call componentDidMount after initialization", () => {
        const spy = Sinon.spy(
          TestComponent.prototype as unknown as TestComponentPrototype,
          "componentDidMount"
        );
        const component = new TestComponent();
        component.dispatchComponentDidMount();

        expect(spy.called).to.equal(true);
        spy.restore();
      });

      it("should call componentDidUpdate when props are updated", () => {
        const spy = Sinon.spy(
          TestComponent.prototype as unknown as TestComponentPrototype,
          "componentDidUpdate"
        );

        const component = new TestComponent("div", { text: "initial" });
        component.dispatchComponentDidMount();

        component.setProps({ text: "updated" });

        expect(spy.called).to.equal(true);
        spy.restore();
      });

      it("should not call componentDidUpdate if props do not change", () => {
        const spy = Sinon.spy(
          TestComponent.prototype as unknown as TestComponentPrototype,
          "componentDidUpdate"
        );
        const component = new TestComponent("div", { text: "same" });

        component.setProps({ text: "same" });

        expect(spy.called).to.equal(false);
        spy.restore();
      });

      it("should call renderComponent during render", () => {
        const spy = Sinon.spy(
          TestComponent.prototype as unknown as TestComponentPrototype,
          "renderComponent"
        );
        const component = new TestComponent();

        component.setProps({ text: "rerender" });

        expect(spy.called).to.equal(true);
        spy.restore();
      });

      it("should call unbindElements, findElements, and bindElements during rerender", () => {
        const unbindSpy = Sinon.spy(
          TestComponent.prototype as unknown as TestComponentPrototype,
          "unbindElements"
        );
        const findSpy = Sinon.spy(
          TestComponent.prototype as unknown as TestComponentPrototype,
          "findElements"
        );
        const bindSpy = Sinon.spy(
          TestComponent.prototype as unknown as TestComponentPrototype,
          "bindElements"
        );

        const component = new TestComponent("div", { text: "init" });
        component.setProps({ text: "changed" });

        expect(unbindSpy.called).to.equal(true);
        expect(findSpy.called).to.equal(true);
        expect(bindSpy.called).to.equal(true);

        unbindSpy.restore();
        findSpy.restore();
        bindSpy.restore();
      });
    });
  });
});
