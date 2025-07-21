import "./Chat.scss";
import template from "./Chat.hbs?raw";
import { compile } from "handlebars";
import { Component } from "@/services/Component";
import { chatsApi } from "@/api/ChatsApi";
import { Button } from "../Button";
import type { Indexed } from "@/utils/set";
import { connect } from "@/services/Store/Connect";
import Store from "@/services/Store/Store";
import { App } from "../App";
import RoutePaths from "@/services/Router/RoutePaths";
import { AddUser } from "../AddUser/AddUser";

export interface ChatData {
  id: number;
  title: string;
  avatar: string | null;
  created_by: number;
  unread_count: number;
  last_message: string | null;
}

interface ChatProps {
  chats?: ChatData[];
  currentChatId?: number | null;
  [key: string]: unknown;
}

class Chat extends Component<ChatProps> {
  private _props: ChatProps;
  private _button: Button;
  private _items: NodeListOf<Element> | null = null;
  private _buttonEvents: HTMLElement | null = null;
  private _userSettingsLink: HTMLElement | null = null;
  private _deleteButton: HTMLElement | null = null;
  private _addUserModal;
  private _addUserModalEvents: HTMLElement | null = null;

  constructor(props: ChatProps = {}) {
    const button = new Button({
      text: "Add chat",
      type: "button",
    });
    const addUserModal = new AddUser({});
    super("template", { ...props, button, addUserModal });
    this._button = button;
    this._props = props;
    this._addUserModal = addUserModal;
  }

  handleClickChat = (id: number) => () => {
    if (Store.getState()?.currentChatId === id) return;
    if (id) {
      Store.set("currentChatId", id);
    }
  };

  handlerClickDeleteChat = async (e: Event, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    await chatsApi.delete({ chatId: id });
    await this.getChatsData();
  };

  handlerClickAddChat = (e: Event) => {
    e.preventDefault();
    this._addUserModalEvents?.classList.add("modal_active");
  };

  render() {
    return compile(template)(this.props);
  }

  renderComponent = () => {
    const placeholder = this.element?.querySelector(
      '[data-component="button"]'
    );
    if (placeholder && this._button.getContent()) {
      placeholder.replaceWith(this._button.getContent()!);
    }
    this._button.dispatchComponentDidMount();

    const addUserPlaceholder = this.element?.querySelector(
      '[data-component="add-user"]'
    );
    if (addUserPlaceholder && this._addUserModal.getContent()) {
      addUserPlaceholder.replaceWith(this._addUserModal.getContent()!);
    }
    this._addUserModal.dispatchComponentDidMount();
  };

  handlerClickLink = (e: Event) => {
    e.preventDefault();
    App.getRouter().go(RoutePaths.UserSettings);
  };

  findElements(): void {
    if (!this.element) return;
    this._items = this.element.querySelectorAll(".chat__item");
    this._buttonEvents = this.element.querySelector("#button");
    this._userSettingsLink = this.element.querySelector("#user-settings");
    this._addUserModalEvents = this.element.querySelector("#user-modal");
  }

  handleClickOutModal = (e: Event) => {
    if (e.target === this._addUserModalEvents) {
      this._addUserModalEvents?.classList.remove("modal_active");
    }
  };

  bindElements() {
    this._items?.forEach((item: Element) => {
      const chatId = Number(item.getAttribute("data-id"));
      item.addEventListener("click", this.handleClickChat(chatId));
      this._deleteButton = item.querySelector("#delete-button");
      this._deleteButton?.addEventListener(
        "click",
        (e: Event) => void this.handlerClickDeleteChat(e, chatId)
      );
    });
    this._buttonEvents?.addEventListener("click", this.handlerClickAddChat);
    this._userSettingsLink?.addEventListener("click", this.handlerClickLink);
    window.addEventListener("click", this.handleClickOutModal);
  }

  unbindElements() {
    if (this._props.chats) {
      this._items?.forEach((item: Element) => {
        const chatId = Number(item.getAttribute("data-id"));
        item.removeEventListener("click", this.handleClickChat(chatId));
        this._deleteButton = item.querySelector("#delete-button");
        this._deleteButton?.removeEventListener(
          "click",
          (e: Event) => void this.handlerClickDeleteChat(e, chatId)
        );
      });
    }
    this._buttonEvents?.removeEventListener("click", this.handlerClickAddChat);
    this._userSettingsLink?.removeEventListener("click", this.handlerClickLink);
    window.removeEventListener("click", this.handleClickOutModal);
  }

  getChatsData = async () => {
    const chats = await chatsApi.getChats();
    if (chats) {
      Store.set("chats", chats);
    }
  };

  componentDidMount() {
    if (!this.props.chats) {
      void this.getChatsData();
    } else {
      this.renderComponent();
      this.findElements();
      this.bindElements();
    }
  }
}

const mapStateToProps = (state: Indexed) => {
  return {
    chats: state.chats as ChatData[] | undefined,
    currentChatId: state.currentChatId as number | null,
  };
};

export const ConnectedChat = connect(mapStateToProps)(Chat);
