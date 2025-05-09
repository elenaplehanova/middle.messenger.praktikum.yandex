import "./ErrorPage.scss";
import { compile } from "handlebars";
import template from "./ErrorPage.hbs?raw";
import { Component } from "@/services/Component";

interface ErrorPageProps {
  text: string;
  [key: string]: unknown;
}

export class ErrorPage extends Component<ErrorPageProps> {
  constructor(props: ErrorPageProps) {
    super("template", props);
  }

  render() {
    return compile(template)(this.props);
  }
}
