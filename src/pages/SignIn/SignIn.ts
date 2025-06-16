import "./SignIn.scss";
import { Button } from "@components/Button";
import template from "./SignIn.hbs?raw";
import { Component } from "@/services/Component";
import { compile } from "handlebars";
import { validateLogin, validatePassword } from "@/utils/validation";
import { QueryParams } from "@/services/HTTPTransport";
import Store from "@/services/Store/Store";
import { connect } from "@/services/Store/Connect";
import { App } from "@/components/App";
import { AuthApi } from "@/api/AuthApi";

type Indexed<T = unknown> = {
  [key in string]: T;
};

interface SignInProps extends Record<string, unknown> {
  button?: Button;
  isAuth?: boolean; // это будет приходить из connect
}

class SignIn extends Component<SignInProps> {
  private _button: Button;
  private _form: HTMLElement | null = null;
  private _loginInput: HTMLInputElement | null = null;
  private _passwordInput: HTMLInputElement | null = null;

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

  handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const isLoginValid = this.validateField(this._loginInput, validateLogin);
    const isPasswordValid = this.validateField(
      this._passwordInput,
      validatePassword
    );

    const isFormValid = isLoginValid?.isValid && isPasswordValid?.isValid;

    if (isFormValid) {
      const authApi = new AuthApi();

      const loginData: QueryParams = {
        login: String(this._loginInput?.value),
        password: String(this._passwordInput?.value),
      };

      try {
        const response = await authApi.signIn(loginData);
        console.log("Registration successful:", response);

        const newPath = "/user-settings";

        Store.set("currentPage", newPath);
        App.getRouter().go(newPath);
      } catch (error) {
        console.error("Registration failed:", error);
      }

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

const mapSignInState = (state: Indexed) => ({
  isAuth: state?.user?.isAuth,
});

export const ConnectedSignIn = connect(mapSignInState)(SignIn);
