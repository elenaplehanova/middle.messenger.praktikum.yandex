import "./SignIn.scss";
import { Button } from "@components/Button";
import template from "./SignIn.hbs?raw";
import { Component } from "@/services/Component";
import { compile } from "handlebars";
import { validateLogin, validatePassword } from "@/utils/validation";

export class SignIn extends Component {
  private _button: Button;

  constructor() {
    const button = new Button({
      text: "Sign in",
      className: "auth-form__button",
      type: "submit",
    });

    super("template", { button });

    this._button = button;
  }
  
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
  };

  private _form: HTMLElement | null = null;
  private _loginInput: HTMLInputElement | null = null;
  private _passwordInput: HTMLInputElement | null = null;

  handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    const isLoginValid = this.validateField(this._loginInput, validateLogin);
    const isPasswordValid = this.validateField(
      this._passwordInput,
      validatePassword
    );

    const isFormValid = isLoginValid?.isValid && isPasswordValid?.isValid;

    if (isFormValid) {
      console.log("form:", {
        login: this._loginInput?.value,
        password: this._passwordInput?.value,
      });
    } else {
      console.log("form is not valid");
    }
  };

  handleLoginBlur = () => {
    this.validateField(this._loginInput, validateLogin);
  };

  handlePasswordBlur = () => {
    this.validateField(this._passwordInput, validatePassword);
  };

  componentDidMount() {
    this.renderComponent();
    if (this.element) {
      this._form = this.element.querySelector(".auth-form__form");
      this._loginInput = this.element.querySelector<HTMLInputElement>("#login");
      this._passwordInput =
        this.element.querySelector<HTMLInputElement>("#password");

      if (this._form) {
        this._form.addEventListener("submit", this.handleSubmit);
      }

      if (this._loginInput) {
        this._loginInput.addEventListener("blur", this.handleLoginBlur);
      }

      if (this._passwordInput) {
        this._passwordInput.addEventListener("blur", this.handlePasswordBlur);
      }
    }
  }
}
