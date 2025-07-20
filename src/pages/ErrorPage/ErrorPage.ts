import "./ErrorPage.scss";
import { compile } from "handlebars";
import template from "./ErrorPage.hbs?raw";
import { Component } from "@/services/Component";
import RoutePaths from "@/services/Router/RoutePaths";
import { App } from "@/components/App";

interface ErrorPageProps {
  text: string;
  [key: string]: unknown;
}

export class ErrorPage extends Component<ErrorPageProps> {
  private _home: Element | null | undefined;

  constructor(props: ErrorPageProps) {
    super("template", props);
  }

  render() {
    return compile(template)(this.props);
  }

  handleClickHome = (e: Event) => {
    e.preventDefault();
    App.getRouter().go(RoutePaths.SignIn);
  };

  findElements(): void {
    if (!this.element) return;

    this._home = this.element.querySelector("#home");
  }

  bindElements(): void {
    this._home?.addEventListener("click", this.handleClickHome);
  }

  unbindElements(): void {
    this._home?.removeEventListener("click", this.handleClickHome);
  }
}
