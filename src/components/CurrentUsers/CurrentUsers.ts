import { Component } from "@/services/Component";
import { Button } from "../Button";
import template from "./CurrentUsers.hbs?raw";
import { compile } from "handlebars";
import "./CurrentUsers.scss";
import { validateLogin } from "@/utils/validation";
import { connect } from "@/services/Store/Connect";
import type { Indexed } from "@/utils/set";
import { chatsApi } from "@/api/ChatsApi";
import type { UserData } from "@/pages/UserSettings/UserSettings";
import Store from "@/services/Store/Store";
import { userApi } from "@/api/UserApi";
import isEqual from "@/utils/isEqual";

interface CurrentUsersProps extends Record<string, unknown> {
  button?: Button;
  currentChatId?: number | null;
  users?: UserData[] | null;
}

class CurrentUsers extends Component<CurrentUsersProps> {
  private _button: Button;
  private _form: HTMLInputElement | null = null;
  private _userLogin: HTMLInputElement | null = null;
  private _closeButton: HTMLElement | null = null;
  private _users: NodeListOf<Element> | null = null;
  private _deleteButton: HTMLElement | null = null;

  constructor(props: CurrentUsersProps = {}) {
    const button = new Button({
      text: "Add",
      className: "current-users__button-add",
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
    e.stopPropagation();
    const isLoginValid = this.validateField(this._userLogin, validateLogin);
    const login = this._userLogin?.value;
    if (
      isLoginValid?.isValid &&
      login &&
      typeof this.props.currentChatId === "number"
    ) {
      try {
        const foundedUsers = await userApi.searchUser({ login: login });
        if (Array.isArray(foundedUsers)) {
          const currentUserId: number = foundedUsers?.[0]?.id;
          await chatsApi.addUsersToChat({
            users: [currentUserId],
            chatId: this.props.currentChatId,
          });
          await this.getUsers();
        }
      } catch (error) {
        console.dir("Failed to add users", error);
      }
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

  handlerClickDeleteUser = async (e: Event, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.currentChatId) {
      await chatsApi.deleteUsersFromChat({
        users: [id],
        chatId: this.props.currentChatId,
      });
      Store.set("users", null);
      await this.getUsers();
    }
  };

  findElements(): void {
    if (!this.element) return;
    this._form = this.element.querySelector<HTMLInputElement>(
      "#current-users-form"
    );
    this._userLogin = this.element.querySelector<HTMLInputElement>("#login");
    this._closeButton = this.element.querySelector("#modal-close");
    this._users = this.element.querySelectorAll(".user-item");
  }

  bindElements(): void {
    this._form?.addEventListener(
      "submit",
      (e: Event) => void this.handleSubmit(e)
    );
    this._userLogin?.addEventListener("blur", this.handleLoginBlur);
    this._closeButton?.addEventListener("click", this.handleClickClose);
    this._users?.forEach((item: Element) => {
      const chatId = Number(item.getAttribute("data-id"));
      this._deleteButton = item.querySelector("#delete-button");
      this._deleteButton?.addEventListener(
        "click",
        (e: Event) => void this.handlerClickDeleteUser(e, chatId)
      );
    });
  }

  unbindElements(): void {
    this._form?.removeEventListener(
      "submit",
      (e: Event) => void this.handleSubmit(e)
    );
    this._userLogin?.removeEventListener("blur", this.handleLoginBlur);
    this._closeButton?.removeEventListener("click", this.handleClickClose);
    this._users?.forEach((item: Element) => {
      const chatId = Number(item.getAttribute("data-id"));
      this._deleteButton = item.querySelector("#delete-button");
      this._deleteButton?.removeEventListener(
        "click",
        (e: Event) => void this.handlerClickDeleteUser(e, chatId)
      );
    });
  }

  public async getUsers() {
    try {
      if (typeof this.props.currentChatId === "number") {
        const users = await chatsApi.getChatsUsers(this.props.currentChatId);
        if (users && Array.isArray(users)) {
          Store.set("users", users);
        }
      }
    } catch (error) {
      console.error("Failed to load users", error);
    }
  }

  componentDidMount() {
    this.renderComponent();
    this.findElements();
    this.bindElements();
  }

  protected componentDidUpdate(
    oldProps: Record<string, unknown>,
    newProps: Record<string, unknown>
  ): boolean {
    const chatChanged = oldProps.currentChatId !== newProps.currentChatId;
    const usersChanged = !isEqual(oldProps.users, newProps.users);

    if (chatChanged) {
      void this.getUsers();
    }
    if (usersChanged) {
      this.renderComponent();
      this.findElements();
      this.unbindElements();
      this.bindElements();
    }
    return !isEqual(oldProps, newProps);
  }
}

const mapStateToProps = (state: Indexed) => {
  return {
    currentChatId: state.currentChatId as number | null,
    users: state.users as UserData[] | null,
  };
};

export const ConnectedCurrentUsers = connect(mapStateToProps)(CurrentUsers);
