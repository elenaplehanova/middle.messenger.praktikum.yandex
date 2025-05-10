import "./MessageBlock.scss";
import { Component } from "@/services/Component";
import template from "./MessageBlock.hbs?raw";
import { compile } from "handlebars";

export type MessageProps = {
  text: string;
  datetime: Date;
  formatDatetime?: string;
  senderName: string;
  isMine?: boolean;
};

export class MessageBlock extends Component {
  constructor(props: MessageProps) {
    super("template", props);
  }

  render() {
    return compile(template)(this.props);
  }
}
