import { Component } from "@/services/Component";
import { Button } from "../Button";
import template from "./AddUser.hbs?raw";
import { compile } from "handlebars";
import { validateLogin } from "@/utils/validation";
import "./AddUser.scss";
import { chatsApi } from "@/api/ChatsApi";
import { userApi } from "@/api/UserApi";
import Store from "@/services/Store/Store";
import type { ChatData } from "../Chat/Chat";

interface AddUserProps extends Record<string, unknown> {
  button?: Button;
}

export class AddUser extends Component {
  private _button: Button;
  private _form: HTMLInputElement | null = null;
  private _userLogin: HTMLInputElement | null = null;
  private _closeButton: HTMLElement | null = null;

  constructor(props: AddUserProps = {}) {
    const button = new Button({
      text: "Add",
      className: "add-user__button-add",
      type: "submit",
    });
    super("template", { ...props, button });
    this._button = button;
  }

  render() {
    return compile(template)(this.props);
  }

  renderComponent = () => {
    const buttonPlaceholder = this.element?.querySelector(
      '[data-component="button"]'
    );
    if (buttonPlaceholder && this._button.getContent()) {
      buttonPlaceholder.replaceWith(this._button.getContent()!);
    }
    this._button.dispatchComponentDidMount();
  };

  handleSubmit = async (e: Event) => {
    e.preventDefault();
    const isLoginValid = this.validateField(this._userLogin, validateLogin);
    const login = this._userLogin?.value;
    if (isLoginValid?.isValid && login) {
      try {
        const foundedUsers = await userApi.searchUser({ login: login });
        if (Array.isArray(foundedUsers)) {
          const currentUserId: number = foundedUsers?.[0]?.id;
          const newChat: ChatData = await chatsApi.create({
            title: login,
          });

          await chatsApi.addUsersToChat({
            users: [currentUserId],
            chatId: newChat.id,
          });

          const chats = await chatsApi.getChats();
          if (chats) {
            Store.set("chats", chats);
          }

          if (newChat.id) {
            Store.set("currentChatId", newChat.id);
          }

          if (!this.element) return;
          this.element.style.display = "none";
        }
      } catch (error) {
        console.dir(error);
      }
    } else {
      console.dir("form is not valid");
    }
  };

  handleLoginBlur = () => {
    this.validateField(this._userLogin, validateLogin);
  };

  handleClickClose = (e: Event) => {
    e.preventDefault();
    if (!this.element) return;
    this.element.style.display = "none";
  };

  private _boundHandleSubmit = (e: Event) => void this.handleSubmit(e);

  findElements(): void {
    if (!this.element) return;
    this._form = this.element.querySelector<HTMLInputElement>("#add-user-form");
    this._userLogin = this.element.querySelector<HTMLInputElement>("#login");
    this._closeButton = this.element.querySelector("#modal-close");
  }

  bindElements(): void {
    this._form?.addEventListener("submit", this._boundHandleSubmit);
    this._userLogin?.addEventListener("blur", this.handleLoginBlur);
    this._closeButton?.addEventListener("click", this.handleClickClose);
  }

  unbindElements(): void {
    this._form?.removeEventListener("submit", this._boundHandleSubmit);
    this._userLogin?.removeEventListener("blur", this.handleLoginBlur);
    this._closeButton?.removeEventListener("click", this.handleClickClose);
  }

  componentDidMount() {
    this.renderComponent();
    this.findElements();
    this.bindElements();
  }
}
