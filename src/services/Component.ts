import { EventBus } from "./EventBus";

export type Props<T = unknown> = T & Record<string, unknown>;

export abstract class Component<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  static EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CDU: "flow:component-did-update",
    FLOW_RENDER: "flow:render",
  } as const;

  private _element: HTMLElement | null = null;
  private readonly _meta: {
    tagName: string;
    props: Props<T>;
  };
  public props: Props<T>;
  private eventBus: () => EventBus;

  /** JSDoc
   * @param {string} tagName
   * @param {Object} props
   *
   * @returns {void}
   */
  constructor(tagName: string = "div", props: Props<T> = {} as Props<T>) {
    const eventBus = new EventBus();
    this._meta = {
      tagName,
      props,
    };

    this.props = this._makePropsProxy(props);
    this.eventBus = () => eventBus;

    this._registerEvents(eventBus);
    eventBus.emit(Component.EVENTS.INIT);
  }

  private _registerEvents(eventBus: EventBus): void {
    eventBus.on(Component.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Component.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Component.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Component.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  private _createResources(): void {
    const { tagName } = this._meta;
    this._element = this._createDocumentElement(tagName);
  }

  private init(): void {
    this._createResources();
    this.eventBus().emit(Component.EVENTS.FLOW_RENDER);
  }

  private _componentDidMount(): void {
    this.componentDidMount(this._meta.props);
  }

  protected componentDidMount(oldProps?: Props<T>): void {
    console.log("oldProps", oldProps);
  }

  public dispatchComponentDidMount(): void {
    this.eventBus().emit(Component.EVENTS.FLOW_CDM);
  }

  private _componentDidUpdate(oldProps: Props<T>, newProps: Props<T>): void {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this._render();
  }

  protected componentDidUpdate(
    oldProps: Props<T>,
    newProps: Props<T>
  ): boolean {
    console.log("oldProps", oldProps, "newProps", newProps);
    return true;
  }

  public setProps(nextProps: Props<T>): void {
    if (!nextProps) {
      return;
    }
    Object.assign(this.props, nextProps);
  }

  get element(): HTMLElement | null {
    return this._element;
  }

  private _render(): void {
    const component = this.render();
    if (this._element) {
      const temp = document.createElement("template");
      temp.innerHTML = component.trim();
      const newElement = temp.content.firstElementChild;
      if (!newElement) {
        throw new Error("Template must return a single root element");
      }
      if (!(newElement instanceof HTMLElement)) {
        throw new Error("Template root must be a valid HTMLElement");
      }
      this._element.replaceWith(newElement);
      this._element = newElement;
    }
  }

  protected render(): string {
    return "";
  }

  public getContent(): HTMLElement | null {
    return this.element;
  }

  private _makePropsProxy(props: Props<T>): Props<T> {
    return new Proxy(props, {
      get: <K extends keyof Props>(target: Props, prop: K): Props[K] => {
        if (typeof prop === "string" && prop.startsWith("_")) {
          throw new Error("Access denied");
        }

        const value = target[prop];
        return typeof value === "function" ? value.bind(target) : value;
      },
      set: <K extends keyof Props>(
        target: Props,
        prop: K,
        value: Props[K]
      ): boolean => {
        target[prop] = value;
        this.eventBus().emit(Component.EVENTS.FLOW_CDU, { ...target }, target);
        return true;
      },
      deleteProperty: () => {
        throw new Error("No access");
      },
    });
  }

  private _createDocumentElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }

  public show(): void {
    const content = this.getContent();
    if (content) {
      content.style.display = "block";
    }
  }

  public hide(): void {
    const content = this.getContent();
    if (content) {
      content.style.display = "none";
    }
  }

  validateField = (
    input: HTMLInputElement | null,
    validator: (value: string | null | undefined) => {
      isValid: boolean;
      error?: string;
    }
  ): { isValid: boolean; error?: string } | null => {
    if (!input) return null;

    const errorElement = this.element?.querySelector<HTMLDivElement>(
      `#${input.id}-error`
    );
    const result = validator(input.value);

    if (errorElement) {
      if (!result.isValid) {
        errorElement.textContent = result.error ?? "";
        errorElement.style.display = "block";
      } else {
        errorElement.textContent = "";
        errorElement.style.display = "none";
      }
    }

    return result;
  };
}
