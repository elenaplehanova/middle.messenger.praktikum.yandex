import "./SignIn.scss";
import { Button } from "@components/Button";
import template from "./SignIn.hbs?raw";
import { Component } from "@/services/Component";
import { compile } from "handlebars";
import { validateLogin, validatePassword } from "@/utils/validation";
import type { QueryParams } from "@/services/HTTPTransport";
import { connect } from "@/services/Store/Connect";
import { App } from "@/components/App";
import RoutePaths from "@/services/Router/RoutePaths";
import { authApi } from "@/api/AuthApi";

interface SignInProps extends Record<string, unknown> {
  button?: Button;
  isAuth?: boolean;
}

class SignIn extends Component<SignInProps> {
  private _button: Button;
  private _form: HTMLElement | null = null;
  private _loginInput: HTMLInputElement | null = null;
  private _passwordInput: HTMLInputElement | null = null;
  private _signUp: HTMLInputElement | null = null;

  constructor(props: SignInProps = {}) {
    const button = new Button({
      text: "Sign in",
      className: "auth-form__button",
      type: "submit",
    });

    super("template", { ...props, button });

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

  handleSubmit = async (e: Event) => {
    e.preventDefault();
    const isLoginValid = this.validateField(this._loginInput, validateLogin);
    const isPasswordValid = this.validateField(
      this._passwordInput,
      validatePassword
    );

    const isFormValid = isLoginValid?.isValid && isPasswordValid?.isValid;

    if (isFormValid) {
      const loginData: QueryParams = {
        login: String(this._loginInput?.value),
        password: String(this._passwordInput?.value),
      };

      try {
        await authApi.signIn(loginData);
        App.getRouter().go(RoutePaths.Messenger);
      } catch (error) {
        console.error("Registration failed:", error);
      }
    } else {
      console.dir("form is not valid");
    }
  };

  handleLoginBlur = () => {
    this.validateField(this._loginInput, validateLogin);
  };

  handlePasswordBlur = () => {
    this.validateField(this._passwordInput, validatePassword);
  };

  handleClickSignUp = (e: Event) => {
    e.preventDefault();
    App.getRouter().go(RoutePaths.SignUp);
  };

  findElements(): void {
    if (!this.element) return;

    this._form = this.element.querySelector(".auth-form__form");
    this._loginInput = this.element.querySelector<HTMLInputElement>("#login");
    this._passwordInput =
      this.element.querySelector<HTMLInputElement>("#password");
    this._signUp = this.element.querySelector("#sign-up");
  }

  bindElements(): void {
    this._form?.addEventListener(
      "submit",
      (e: Event) => void this.handleSubmit(e)
    );
    this._loginInput?.addEventListener("blur", this.handleLoginBlur);
    this._passwordInput?.addEventListener("blur", this.handlePasswordBlur);
    this._signUp?.addEventListener("click", this.handleClickSignUp);
  }

  unbindElements(): void {
    this._form?.removeEventListener(
      "submit",
      (e: Event) => void this.handleSubmit(e)
    );
    this._loginInput?.removeEventListener("blur", this.handleLoginBlur);
    this._passwordInput?.removeEventListener("blur", this.handlePasswordBlur);
    this._signUp?.removeEventListener("click", this.handleClickSignUp);
  }

  componentDidMount() {
    this.renderComponent();
    this.findElements();
    this.bindElements();
  }
}

const mapSignInState = (state: { user?: { isAuth?: boolean } }) => ({
  isAuth: state?.user?.isAuth,
});

export const ConnectedSignIn = connect(mapSignInState)(SignIn);
