import "./Messenger.scss";
import template from "./Messenger.hbs?raw";
import { Component } from "@/services/Component";
import { compile } from "handlebars";
import type { ChatItem } from "@/components/Chat/Chat";
import { Chat } from "@/components/Chat/Chat";
import { ChatRoom } from "@/components/ChatRoom";

export class Messenger extends Component {
  private _chat: Chat;
  private _chatRoom: ChatRoom;

  constructor() {
    const chats: ChatItem[] = [
      {
        id: "1",
        userName: "Lida",
        lastMessage: "ахах понятно) прикольно",
        isActive: true,
      },
      {
        id: "2",
        userName: "John )))",
        lastMessage: "ok",
      },
      {
        id: "3",
        userName: "Maya",
        lastMessage: "да.. бывает..",
      },
    ];

    const chatRoom = new ChatRoom({
      activeUserName: chats[0].userName,
    });

    const chat = new Chat({
      chats,
      onSelectChat: (selectedChat) => {
        this.selectChat(selectedChat);
      },
    });

    super("template", { chat, chatRoom });

    this._chat = chat;
    this._chatRoom = chatRoom;
  }

  selectChat(selectedChat: ChatItem) {
    this._chatRoom.setProps({
      activeUserName: selectedChat.userName,
    });
  }

  render() {
    return compile(template)(this.props);
  }

  renderComponent = () => {
    const chatPlaceholder = this.element?.querySelector(
      '[data-component="chat"]'
    );
    if (chatPlaceholder && this._chat.getContent()) {
      chatPlaceholder.replaceWith(this._chat.getContent()!);
    }
    this._chat.dispatchComponentDidMount();

    const chatRoomPlaceholder = this.element?.querySelector(
      '[data-component="chat-room"]'
    );
    if (chatRoomPlaceholder && this._chatRoom.getContent()) {
      chatRoomPlaceholder.replaceWith(this._chatRoom.getContent()!);
    }
    this._chatRoom.dispatchComponentDidMount();
  };

  componentDidMount() {
    this.renderComponent();
  }
}
