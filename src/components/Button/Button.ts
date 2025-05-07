import { compile } from "handlebars";
import template from "./Button.hbs?raw";
import { Component } from "@/services/Component";

interface ButtonProps {
  text: string;
  type?: "button" | "submit";
  className?: string;
}

export class Button extends Component {
  constructor(props: ButtonProps) {
    super("template", props);
  }

  render() {
    return compile(template)(this.props);
  }
}
