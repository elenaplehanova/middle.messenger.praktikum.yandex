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
import { QueryParams } from "@/services/HTTPTransport";
import { AuthApi } from "@/api/AuthApi";
import { App } from "@/components/App";

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

  handleSubmit = async (e: SubmitEvent) => {
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
      const authApi = new AuthApi();

      const registrationData: QueryParams = {
        first_name: String(this._firstNameInput?.value),
        second_name: String(this._secondNameInput?.value),
        login: String(this._loginInput?.value),
        email: String(this._emailInput?.value),
        password: String(this._passwordInput?.value),
        phone: String(this._phoneInput?.value),
      };

      // signUpApi.create(registrationData);

      try {
        const logout = await authApi.logout();
        console.log("logout", logout);

        const response = await authApi.create(registrationData);
        console.log("Registration successful:", response);

        App.getRouter().go("/sign-in");

        // или показать сообщение об успешной регистрации
      } catch (error) {
        console.error("Registration failed:", error);
        // Здесь можно показать пользователю сообщение об ошибке
      }

      // console.log("form:", registrationData);
    } else {
      console.log("form is not valid");
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

  componentDidMount() {
    this.renderComponent();
    if (this.element) {
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

      if (this._form) {
        this._form.addEventListener("submit", this.handleSubmit);
      }

      if (this._firstNameInput) {
        this._firstNameInput.addEventListener("blur", this.handleFirstNameBlur);
      }

      if (this._secondNameInput) {
        this._secondNameInput.addEventListener(
          "blur",
          this.handleSecondNameBlur
        );
      }

      if (this._loginInput) {
        this._loginInput.addEventListener("blur", this.handleLoginBlur);
      }

      if (this._emailInput) {
        this._emailInput.addEventListener("blur", this.handleEmailBlur);
      }

      if (this._passwordInput) {
        this._passwordInput.addEventListener("blur", this.handlePasswordBlur);
      }

      if (this._phoneInput) {
        this._phoneInput.addEventListener("blur", this.handlePhoneBlur);
      }
    }
  }
}
