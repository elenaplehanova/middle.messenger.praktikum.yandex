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
}

export class Chat extends Component {
  constructor(props: ChatProps) {
    super("template", props);
  }

  handleChatClick = (chat: ChatItem) => () => {
    const updatedChats = this.props.chats.map((c: ChatItem) => ({
      ...c,
      isActive: c.id === chat.id,
    }));

    this.setProps({ chats: updatedChats });
    this.bindEvents();
    this.props.onSelectChat?.(chat);
  };

  componentDidMount() {
    this.bindEvents();
  }

  private bindEvents() {
    const items = this.element?.querySelectorAll(".chat__item");
    items?.forEach((item) => {
      const chatId = item.getAttribute("data-id");
      const chat = this.props.chats.find((c: ChatItem) => c.id === chatId);

      if (chat) {
        item.addEventListener("click", this.handleChatClick(chat));
      }
    });
  }

  render() {
    return compile(template)(this.props);
  }
}
