import "./Chat.scss";
import template from "./Chat.hbs?raw";
import { compile } from "handlebars";
import { Component } from "@/services/Component";

export interface ChatItem {
  id: string;
  userName: string;
  lastMessage: string;
  isActive?: boolean;
}

interface ChatProps {
  chats: ChatItem[];
  onSelectChat?: (chat: ChatItem) => void;
  [key: string]: unknown;
}

export class Chat extends Component<ChatProps> {
  private _props: ChatProps;

  constructor(props: ChatProps) {
    super("template", props);

    this._props = props;
  }

  handleChatClick = (chat: ChatItem) => () => {
    const updatedChats = this._props.chats.map((c: ChatItem) => ({
      ...c,
      isActive: c.id === chat.id,
    }));

    this.setProps({ chats: updatedChats });
    this.bindEvents();
    this._props.onSelectChat?.(chat);
  };

  componentDidMount() {
    this.bindEvents();
  }

  private bindEvents() {
    const items = this.element?.querySelectorAll(".chat__item");
    items?.forEach((item) => {
      const chatId = item.getAttribute("data-id");
      const chat = this._props.chats.find((c: ChatItem) => c.id === chatId);

      if (chat) {
        item.addEventListener("click", this.handleChatClick(chat));
      }
    });
  }

  render() {
    return compile(template)(this.props);
  }
}
