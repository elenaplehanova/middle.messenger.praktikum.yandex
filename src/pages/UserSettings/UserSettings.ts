import "./UserSettings.scss";
import { Button } from "@components/Button";
import template from "./UserSettings.hbs?raw";
import { Component } from "@/services/Component";
import { compile } from "handlebars";
import {
  validateEmail,
  validateLogin,
  validateName,
  validatePassword,
  validatePhone,
} from "@/utils/validation";

export class UserSettings extends Component {
  private _button: Button;

  constructor() {
    const button = new Button({
      text: "Save",
      className: "user-settings__button",
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
  private _firstNameInput: HTMLInputElement | null = null;
  private _secondNameInput: HTMLInputElement | null = null;
  private _displayNameInput: HTMLInputElement | null = null;
  private _loginInput: HTMLInputElement | null = null;
  private _emailInput: HTMLInputElement | null = null;
  private _phoneInput: HTMLInputElement | null = null;
  private _oldPasswordInput: HTMLInputElement | null = null;
  private _newPasswordInput: HTMLInputElement | null = null;
  private _image: HTMLImageElement | null = null;
  private _avatar: HTMLInputElement | null = null;
  private _changePhoto: HTMLButtonElement | null = null;

  handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const isFirstNameValid = this.validateField(
      this._firstNameInput,
      validateName
    );
    const isSecondNameValid = this.validateField(
      this._secondNameInput,
      validateName
    );
    const isDisplayNameValid = this.validateField(
      this._displayNameInput,
      validateName
    );
    const isLoginValid = this.validateField(this._loginInput, validateLogin);
    const isEmailValid = this.validateField(this._emailInput, validateEmail);
    const isPhoneValid = this.validateField(this._phoneInput, validatePhone);
    const isOldPasswordValid = this.validateField(
      this._oldPasswordInput,
      validatePassword
    );
    const isNewPasswordValid = this.validateField(
      this._newPasswordInput,
      validatePassword
    );

    const isFormValid =
      isFirstNameValid?.isValid &&
      isSecondNameValid?.isValid &&
      isDisplayNameValid?.isValid &&
      isLoginValid?.isValid &&
      isEmailValid?.isValid &&
      isPhoneValid?.isValid &&
      isOldPasswordValid?.isValid &&
      isNewPasswordValid?.isValid;

    if (isFormValid) {
      console.log("form:", {
        first_name: this._firstNameInput?.value,
        second_name: this._secondNameInput?.value,
        display_name: this._displayNameInput?.value,
        login: this._loginInput?.value,
        email: this._emailInput?.value,
        phone: this._phoneInput?.value,
        oldPassword: this._oldPasswordInput?.value,
        newPassword: this._newPasswordInput?.value,
      });
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

  handleDisplayNameBlur = () => {
    this.validateField(this._displayNameInput, validateName);
  };

  handleLoginBlur = () => {
    this.validateField(this._loginInput, validateLogin);
  };

  handleEmailBlur = () => {
    this.validateField(this._emailInput, validateEmail);
  };

  handlePhoneBlur = () => {
    this.validateField(this._phoneInput, validatePhone);
  };

  handleOldPasswordBlur = () => {
    this.validateField(this._oldPasswordInput, validatePassword);
  };

  handleNewPasswordBlur = () => {
    this.validateField(this._newPasswordInput, validatePassword);
  };

  componentDidMount() {
    this.renderComponent();
    if (this.element) {
      this._form = this.element.querySelector(".user-settings__form");
      this._firstNameInput =
        this.element.querySelector<HTMLInputElement>("#first_name");
      this._secondNameInput =
        this.element.querySelector<HTMLInputElement>("#second_name");
      this._displayNameInput =
        this.element.querySelector<HTMLInputElement>("#display_name");
      this._loginInput = this.element.querySelector<HTMLInputElement>("#login");
      this._emailInput = this.element.querySelector<HTMLInputElement>("#email");
      this._phoneInput = this.element.querySelector<HTMLInputElement>("#phone");
      this._oldPasswordInput =
        this.element.querySelector<HTMLInputElement>("#oldPassword");
      this._newPasswordInput =
        this.element.querySelector<HTMLInputElement>("#newPassword");
      this._image = this.element.querySelector<HTMLImageElement>("#image");
      this._avatar = this.element.querySelector<HTMLInputElement>("#avatar");
      this._changePhoto =
        this.element.querySelector<HTMLButtonElement>("#changePhoto");

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

      if (this._displayNameInput) {
        this._displayNameInput.addEventListener(
          "blur",
          this.handleDisplayNameBlur
        );
      }

      if (this._loginInput) {
        this._loginInput.addEventListener("blur", this.handleLoginBlur);
      }

      if (this._emailInput) {
        this._emailInput.addEventListener("blur", this.handleEmailBlur);
      }

      if (this._phoneInput) {
        this._phoneInput.addEventListener("blur", this.handlePhoneBlur);
      }

      if (this._oldPasswordInput) {
        this._oldPasswordInput.addEventListener(
          "blur",
          this.handleOldPasswordBlur
        );
      }

      if (this._newPasswordInput) {
        this._newPasswordInput.addEventListener(
          "blur",
          this.handleNewPasswordBlur
        );
      }

      if (this._changePhoto) {
        this._changePhoto.addEventListener("click", () => {
          if (this._avatar) {
            this._avatar.click();
          }
        });
      }
      if (this._avatar) {
        this._avatar.addEventListener("change", () => {
          if (this._avatar?.files) {
            if (this._avatar?.files?.length > 0) {
              if (this._image) {
                this._image.src = URL.createObjectURL(this._avatar.files[0]);
              }
            }
          }
        });
      }
    }
  }
}
