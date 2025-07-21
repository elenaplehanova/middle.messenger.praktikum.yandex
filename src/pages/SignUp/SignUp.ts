import "./SignUp.scss";
import { Button } from "@components/Button";
import template from "./SignUp.hbs?raw";
import { Component } from "@/services/Component";
import { compile } from "handlebars";
import {
  validateEmail,
  validateLogin,
  validateName,
  validatePassword,
  validatePhone,
} from "@/utils/validation";
import type { QueryParams } from "@/services/HTTPTransport";
import { App } from "@/components/App";
import RoutePaths from "@/services/Router/RoutePaths";
import { authApi } from "@/api/AuthApi";

export interface RegistrationData {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
}

export class SignUp extends Component {
  private _button: Button;
  private _form: HTMLElement | null = null;
  private _firstNameInput: HTMLInputElement | null = null;
  private _secondNameInput: HTMLInputElement | null = null;
  private _loginInput: HTMLInputElement | null = null;
  private _emailInput: HTMLInputElement | null = null;
  private _passwordInput: HTMLInputElement | null = null;
  private _phoneInput: HTMLInputElement | null = null;
  private _signIn: HTMLInputElement | null = null;

  constructor() {
    const button = new Button({
      text: "Sign up",
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

  handleSubmit = async (e: Event) => {
    e.preventDefault();
    const isFirstNameValid = this.validateField(
      this._firstNameInput,
      validateName
    );
    const isSecondNameValid = this.validateField(
      this._secondNameInput,
      validateName
    );
    const isLoginValid = this.validateField(this._loginInput, validateLogin);
    const isEmailValid = this.validateField(this._emailInput, validateEmail);
    const isPasswordValid = this.validateField(
      this._passwordInput,
      validatePassword
    );
    const isPhoneValid = this.validateField(this._phoneInput, validatePhone);

    const isFormValid =
      isFirstNameValid?.isValid &&
      isSecondNameValid?.isValid &&
      isLoginValid?.isValid &&
      isEmailValid?.isValid &&
      isPasswordValid?.isValid &&
      isPhoneValid?.isValid;

    if (isFormValid) {
      const registrationData: QueryParams = {
        first_name: String(this._firstNameInput?.value),
        second_name: String(this._secondNameInput?.value),
        login: String(this._loginInput?.value),
        email: String(this._emailInput?.value),
        password: String(this._passwordInput?.value),
        phone: String(this._phoneInput?.value),
      };

      try {
        await authApi.create(registrationData);
        App.getRouter().go(RoutePaths.SignIn);
      } catch (error) {
        console.dir("Registration failed:", error);
      }
    } else {
      console.dir("form is not valid");
    }
  };

  handleFirstNameBlur = () => {
    this.validateField(this._firstNameInput, validateName);
  };

  handleSecondNameBlur = () => {
    this.validateField(this._secondNameInput, validateName);
  };

  handleLoginBlur = () => {
    this.validateField(this._loginInput, validateLogin);
  };

  handleEmailBlur = () => {
    this.validateField(this._emailInput, validateEmail);
  };

  handlePasswordBlur = () => {
    this.validateField(this._passwordInput, validatePassword);
  };

  handlePhoneBlur = () => {
    this.validateField(this._phoneInput, validatePhone);
  };

  handleClickSignIn = (e: Event) => {
    e.preventDefault();
    App.getRouter().go(RoutePaths.SignIn);
  };

  findElements(): void {
    if (!this.element) return;

    this._form = this.element.querySelector(".auth-form__form");
    this._firstNameInput =
      this.element.querySelector<HTMLInputElement>("#first_name");
    this._secondNameInput =
      this.element.querySelector<HTMLInputElement>("#second_name");
    this._loginInput = this.element.querySelector<HTMLInputElement>("#login");
    this._emailInput = this.element.querySelector<HTMLInputElement>("#email");
    this._passwordInput =
      this.element.querySelector<HTMLInputElement>("#password");
    this._phoneInput = this.element.querySelector<HTMLInputElement>("#phone");
    this._signIn = this.element.querySelector("#sign-in");
  }

  bindElements(): void {
    this._form?.addEventListener(
      "submit",
      (e: Event) => void this.handleSubmit(e)
    );
    this._firstNameInput?.addEventListener("blur", this.handleFirstNameBlur);
    this._secondNameInput?.addEventListener("blur", this.handleSecondNameBlur);
    this._loginInput?.addEventListener("blur", this.handleLoginBlur);
    this._emailInput?.addEventListener("blur", this.handleEmailBlur);
    this._passwordInput?.addEventListener("blur", this.handlePasswordBlur);
    this._phoneInput?.addEventListener("blur", this.handlePhoneBlur);
    this._signIn?.addEventListener("click", this.handleClickSignIn);
  }

  unbindElements(): void {
    this._form?.removeEventListener(
      "submit",
      (e: Event) => void this.handleSubmit(e)
    );
    this._firstNameInput?.removeEventListener("blur", this.handleFirstNameBlur);
    this._secondNameInput?.removeEventListener(
      "blur",
      this.handleSecondNameBlur
    );
    this._loginInput?.removeEventListener("blur", this.handleLoginBlur);
    this._emailInput?.removeEventListener("blur", this.handleEmailBlur);
    this._passwordInput?.removeEventListener("blur", this.handlePasswordBlur);
    this._phoneInput?.removeEventListener("blur", this.handlePhoneBlur);
    this._signIn?.removeEventListener("click", this.handleClickSignIn);
  }

  componentDidMount() {
    this.renderComponent();
    this.findElements();
    this.bindElements();
  }
}
