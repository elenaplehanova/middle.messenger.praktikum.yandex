import "./ChatRoom.scss";
import template from "./ChatRoom.hbs?raw";
import { compile } from "handlebars";
import { Component } from "@/services/Component";
import { Button } from "@components/Button";
import { validateMessage } from "@/utils/validation";
import type { MessageProps } from "../MessageBlock";
import { MessageBlock } from "../MessageBlock";
import { formatTime } from "@/utils/formatData";

interface ChatRoomProps {
  activeUserName?: string;
}

export class ChatRoom extends Component {
  private _form: HTMLElement | null = null;
  private _messageInput: HTMLInputElement | null = null;
  private _yourSenderName = "Вы";
  private _activeUser = "Lida";
  private _messagesByUser: Record<string, MessageProps[]> = {
    Lida: [
      {
        text: "У коллеги в чате gpt по подписке я сгенерила эту фотку, правда у Киры получилось три руки )))",
        datetime: new Date("2025-04-27T19:16:53.383Z"),
        senderName: "Lida",
      },
      {
        text: "ахах понятно) прикольно",
        datetime: new Date("2025-04-27T19:16:56.250Z"),
        senderName: this._yourSenderName,
      },
    ],
    "John )))": [
      {
        text: "ok",
        datetime: new Date("2025-04-27T18:00:00.000Z"),
        senderName: "John )))",
      },
    ],
    Maya: [
      {
        text: "да.. бывает..",
        datetime: new Date("2025-04-27T17:00:00.000Z"),
        senderName: "Maya",
      },
    ],
  };

  constructor(props: ChatRoomProps) {
    const button = new Button({
      text: "Send",
      className: "chat-room__button",
      type: "submit",
    });

    super("template", { ...props, button });
  }

  render() {
    return compile(template)(this.props);
  }

  renderComponent = () => {
    const buttonPlaceholder = this.element?.querySelector(
      '[data-component="button"]'
    );
    if (buttonPlaceholder && this.props.button.getContent()) {
      buttonPlaceholder.replaceWith(this.props.button.getContent());
    }
    this.props.button.dispatchComponentDidMount();
  };

  override setProps(nextProps: ChatRoomProps) {
    const prevUser = this.props.activeUserName;
    super.setProps(nextProps);

    if (nextProps.activeUserName && nextProps.activeUserName !== prevUser) {
      this._activeUser = nextProps.activeUserName;
      this.renderMessages();
      this.renderComponent();
    }
  }

  handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const isMessageValid = this.validateField(
      this._messageInput,
      validateMessage
    );

    if (isMessageValid?.isValid && this._messageInput) {
      const newMessage: MessageProps = {
        text: this._messageInput.value,
        datetime: new Date(),
        senderName: this._yourSenderName,
      };

      if (!this._messagesByUser[this._activeUser]) {
        this._messagesByUser[this._activeUser] = [];
      }
      this._messagesByUser[this._activeUser].push(newMessage);
      this.renderMessages();

      console.log("form:", {
        message: this._messageInput.value,
      });
      this._messageInput.value = "";
    } else {
      console.log("form is not valid");
    }
  };

  handleMessageBlur = () => {
    this.validateField(this._messageInput, validateMessage);
  };

  renderMessages() {
    const messagesContainer = this.element?.querySelector(
      ".chat-room__container"
    );
    if (!messagesContainer) return;

    messagesContainer.innerHTML = "";

    const messages = this._messagesByUser[this._activeUser] || [];

    messages.forEach((msgData) => {
      const isMine = msgData.senderName === this._yourSenderName;

      const message = new MessageBlock({
        ...msgData,
        datetime:
          msgData.datetime instanceof Date
            ? msgData.datetime
            : new Date(msgData.datetime),
        formatDatetime: formatTime(msgData.datetime),
        isMine,
      });

      if (message.getContent()) {
        messagesContainer.appendChild(message.getContent()!);
      }
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  componentDidMount() {
    this.renderComponent();
    if (this.element) {
      this._form = this.element.querySelector(".chat-room__message-panel");
      this._messageInput =
        this.element.querySelector<HTMLInputElement>("#message");
      if (this._form) {
        this._form.addEventListener("submit", this.handleSubmit);
      }
      if (this._messageInput) {
        this._messageInput.addEventListener("blur", this.handleMessageBlur);
      }
      this.renderMessages();
    }
  }
}
