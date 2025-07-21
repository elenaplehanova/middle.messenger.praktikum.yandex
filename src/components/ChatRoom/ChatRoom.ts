import "./ChatRoom.scss";
import template from "./ChatRoom.hbs?raw";
import { compile } from "handlebars";
import type { Props } from "@/services/Component";
import { Component } from "@/services/Component";
import { Button } from "@components/Button";
import { validateMessage } from "@/utils/validation";
import type { MessageProps } from "../MessageBlock";
import { MessageBlock } from "../MessageBlock";
import { formatTime } from "@/utils/formatData";
import type { Indexed } from "@/utils/set";
import { connect } from "@/services/Store/Connect";
import type { ChatData } from "../Chat/Chat";
import { chatsApi } from "@/api/ChatsApi";
import isEqual from "@/utils/isEqual";
import { WebSocketClient } from "@/services/WebSocketClient";
import Store from "@/services/Store/Store";
import type { UserData } from "@/pages/UserSettings/UserSettings";
import type { IncomingMessage } from "@/services/WebSocketClient";
import { authApi } from "@/api/AuthApi";

interface ChatRoomProps {
  user?: UserData;
  currentChat?: ChatData;
  currentChatId?: number;
  [key: string]: unknown;
}

export interface ChatToken {
  token: string;
}

class ChatRoom extends Component<ChatRoomProps> {
  private _button: Button;
  private _form: HTMLElement | null = null;
  private _messageInput: HTMLInputElement | null = null;
  private _client: WebSocketClient | null = null;
  private _messagesByChat: Record<number, MessageProps[]> = {};

  constructor(props: ChatRoomProps = {}) {
    const button = new Button({
      text: "Send",
      className: "chat-room__button",
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

  handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const isMessageValid = this.validateField(
      this._messageInput,
      validateMessage
    );

    if (isMessageValid?.isValid && this._messageInput) {
      this._client?.sendMessage(this._messageInput.value);
      this.renderMessages();
      this._messageInput.value = "";
    } else {
      console.dir("form is not valid");
    }
  };

  handleMessageBlur = () => {
    this.validateField(this._messageInput, validateMessage);
  };

  renderMessages() {
    const currentId = this.props.currentChatId!;
    const messagesContainer = this.element?.querySelector(
      ".chat-room__container"
    );
    if (!messagesContainer) return;

    messagesContainer.innerHTML = "";
    const messages = this._messagesByChat[currentId] || [];

    messages.forEach((messageItem) => {
      const message = new MessageBlock({
        ...messageItem,
        datetime:
          messageItem.datetime instanceof Date
            ? messageItem.datetime
            : new Date(messageItem.datetime),
        formatDatetime: formatTime(messageItem.datetime),
      });

      if (message.getContent()) {
        messagesContainer.appendChild(message.getContent()!);
      }
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  findElements = (): void => {
    if (!this.element) return;

    this._form = this.element.querySelector(".chat-room__message-panel");
    this._messageInput =
      this.element.querySelector<HTMLInputElement>("#message");
  };

  bindElements = (): void => {
    this._form?.addEventListener("submit", this.handleSubmit);
    this._messageInput?.addEventListener("blur", this.handleMessageBlur);
  };

  unbindElements = (): void => {
    this._form?.removeEventListener("submit", this.handleSubmit);
    this._messageInput?.removeEventListener("blur", this.handleMessageBlur);
  };

  startChat = async () => {
    const currentId = this.props.currentChatId;
    if (this._client) {
      this._client.close();
    }
    const currentUser = this.props.user;
    if (!currentUser) {
      const userData = await authApi.getUser();
      if (userData) {
        Store.set("user", { ...userData, isAuth: true });
      }
    }
    const chatId = this.props.currentChatId;
    if (chatId && Array.isArray(this.props.chats) && currentId) {
      const token = await chatsApi.getToken(chatId);

      if (token && currentUser?.id) {
        this._client = new WebSocketClient(
          `wss://ya-praktikum.tech/ws/chats/${currentUser?.id}/${chatId}/${token.token}`
        );

        this._client.onOpen(() => {
          this._client?.getMessages();
        });

        this._client.onMessage((data) => {
          if (Array.isArray(data)) {
            this._messagesByChat[currentId] = [];
            data
              .sort(
                (a, b) =>
                  new Date(a.time).getTime() - new Date(b.time).getTime()
              )
              .forEach((message) => this.addMessageFromSocket(message));
          } else if (data.type === "message") {
            this.addMessageFromSocket(data);
          }
        });
      }
    }
  };

  addMessageFromSocket(message: IncomingMessage) {
    const currentId = this.props.currentChatId!;
    const newMessage: MessageProps = {
      text: message.content,
      datetime: new Date(message.time),
      isMine: message.user_id === this.props.user?.id,
    };

    if (!this._messagesByChat[currentId]) {
      this._messagesByChat[currentId] = [];
    }

    this._messagesByChat[currentId].push(newMessage);
    this.renderMessages();
  }

  componentDidMount() {
    if (this.props.currentChatId) {
      this.renderComponent();
      this.findElements();
      this.bindElements();
    }
  }

  protected componentDidUpdate(
    oldProps: Props<ChatRoomProps>,
    newProps: Props<ChatRoomProps>
  ): boolean {
    const res = !isEqual(oldProps, newProps);
    if (res) {
      void this.startChat();
    }
    return res;
  }
}

const mapStateToProps = (state: Indexed) => {
  const chats = state.chats as ChatData[] | undefined;
  const currentChatId = state.currentChatId as number | null;
  const currentChat = chats?.find((chat) => chat.id === currentChatId);

  return {
    chats,
    currentChatId,
    currentChat,
    user: state.user as UserData | null,
  };
};

export const ConnectedChatRoom = connect(mapStateToProps)(ChatRoom);
