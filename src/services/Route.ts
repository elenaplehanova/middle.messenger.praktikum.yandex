import { Component } from "./Component";

function render(query: string, block: Component) {
  const root = document.querySelector(query);
  if (!root) {
    throw new Error(`Element "${query}" not found`);
  }

  const content = block.getContent();
  if (content) {
    root.innerHTML = "";
    root.appendChild(content);
  }
  
  block.dispatchComponentDidMount();

  return root;
}

type RouteProps = {
  rootQuery: string;
  [key: string]: unknown;
};

export class Route {
  protected _pathname: string;
  protected _blockClass: new (...args: any[]) => Component;
  protected _block: Component | null;
  protected _props: RouteProps;

  constructor(
    pathname: string,
    view: new (...args: any[]) => Component,
    props: RouteProps
  ) {
    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
  }

  navigate(pathname: string) {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave() {
    if (this._block) {
      this._block.hide();
    }
  }

  match(pathname: string): boolean {
    return this._pathname === "*" || this._pathname === pathname;
  }

  render() {
    if (!this._block) {
      this._block = new this._blockClass();
      render(this._props.rootQuery, this._block);
      return;
    }

    this._block.show();
  }
}
