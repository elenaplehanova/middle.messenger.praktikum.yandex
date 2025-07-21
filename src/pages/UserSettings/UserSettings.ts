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
import { connect } from "@/services/Store/Connect";
import type { Indexed } from "@/utils/set";
import Store from "@/services/Store/Store";
import { App } from "@/components/App";
import { userApi } from "@/api/UserApi";
import type { QueryParams } from "@/services/HTTPTransport";
import RoutePaths from "@/services/Router/RoutePaths";
import { authApi } from "@/api/AuthApi";

export interface UserData {
  id?: number;
  first_name?: string;
  second_name?: string;
  display_name?: string;
  login?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

interface UserSettingsProps extends Record<string, unknown> {
  button?: Button;
  user?: UserData;
}

class UserSettings extends Component<UserSettingsProps> {
  private _button: Button;
  private _form: HTMLElement | null = null;
  private _firstNameInput: HTMLInputElement | null = null;
  private _secondNameInput: HTMLInputElement | null = null;
  private _displayNameInput: HTMLInputElement | null = null;
  private _loginInput: HTMLInputElement | null = null;
  private _emailInput: HTMLInputElement | null = null;
  private _phoneInput: HTMLInputElement | null = null;
  private _passwordToggle: HTMLInputElement | null = null;
  private _oldPasswordInput: HTMLInputElement | null = null;
  private _newPasswordInput: HTMLInputElement | null = null;
  private _image: HTMLImageElement | null = null;
  private _avatar: HTMLInputElement | null = null;
  private _changePhoto: HTMLButtonElement | null = null;
  private _logOut: Element | null | undefined;

  constructor(props: UserSettingsProps = {}) {
    const button = new Button({
      text: "Save",
      className: "user-settings__button",
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

  getUserData = async () => {
    if (Store.getState().user) return;
    const userData = await authApi.getUser();
    if (userData) {
      Store.set("user", { ...userData, isAuth: true });
    }
  };

  submitGeneralSettings = async () => {
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
    const isUserProfileValid =
      isFirstNameValid?.isValid &&
      isSecondNameValid?.isValid &&
      isDisplayNameValid?.isValid &&
      isLoginValid?.isValid &&
      isEmailValid?.isValid &&
      isPhoneValid?.isValid;

    if (isUserProfileValid) {
      try {
        const userData: QueryParams = {
          first_name: String(this._firstNameInput?.value),
          second_name: String(this._secondNameInput?.value),
          display_name: String(this._displayNameInput?.value),
          login: String(this._loginInput?.value),
          email: String(this._emailInput?.value),
          phone: String(this._phoneInput?.value),
        };

        await userApi.update(userData);
      } catch (error) {
        console.dir("Error in update user data", error);
      }
    }
  };

  submitPhoto = async () => {
    if (this._avatar?.files?.[0]) {
      try {
        const formData = new FormData();
        formData.append("avatar", this._avatar.files[0]);
        await userApi.changeAvatar(formData);
      } catch (error) {
        console.dir("Error in update avatar", error);
      }
    }
  };

  submitPassword = async () => {
    if (this._passwordToggle?.checked) {
      const isOldPasswordValid = this.validateField(
        this._oldPasswordInput,
        validatePassword
      );
      const isNewPasswordValid = this.validateField(
        this._newPasswordInput,
        validatePassword
      );
      const isPasswordValid =
        isOldPasswordValid?.isValid && isNewPasswordValid?.isValid;

      const passwordData: QueryParams = {
        oldPassword: String(this._oldPasswordInput?.value),
        newPassword: String(this._newPasswordInput?.value),
      };

      if (isPasswordValid) {
        try {
          await userApi.changePassword(passwordData);
        } catch (error) {
          console.dir("Error in update password", error);
        }
      }
    }
  };

  handleSubmit = async (e: Event) => {
    e.preventDefault();
    try {
      await this.submitGeneralSettings();
      await this.submitPhoto();
      await this.submitPassword();
    } catch (error) {
      console.dir(error);
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

  handleClickLogout = async (e: Event) => {
    e.preventDefault();
    try {
      await authApi.logout();
      Store.set("user", null);
      App.getRouter().go(RoutePaths.SignIn);
    } catch (error) {
      console.dir(error);
    }
  };

  handleClickChangePhoto = () => {
    this._avatar?.click();
  };

  handleChangeAvatar = () => {
    if (this._avatar?.files?.length) {
      this._image!.src = URL.createObjectURL(this._avatar.files[0]);
    }
  };

  handlePasswordToggle = (e: Event) => {
    const isChecked = (e.target as HTMLInputElement).checked;

    if (this._oldPasswordInput) {
      this._oldPasswordInput.disabled = !isChecked;
    }

    if (this._newPasswordInput) {
      this._newPasswordInput.disabled = !isChecked;
    }

    if (!isChecked) {
      if (this._oldPasswordInput) this._oldPasswordInput.value = "";
      if (this._newPasswordInput) this._newPasswordInput.value = "";
    }
  };

  findElements = () => {
    if (!this.element) return;

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
    this._passwordToggle =
      this.element.querySelector<HTMLInputElement>("#password-toggle");
    this._oldPasswordInput =
      this.element.querySelector<HTMLInputElement>("#oldPassword");
    this._newPasswordInput =
      this.element.querySelector<HTMLInputElement>("#newPassword");
    this._image = this.element.querySelector<HTMLImageElement>("#image");
    this._avatar = this.element.querySelector<HTMLInputElement>("#avatar");
    this._changePhoto =
      this.element.querySelector<HTMLButtonElement>("#changePhoto");
    this._logOut = this.element.querySelector("#logOut");
  };

  bindElements = () => {
    this._logOut?.addEventListener(
      "click",
      (e) => void this.handleClickLogout(e)
    );
    this._form?.addEventListener("submit", (e) => {
      void this.handleSubmit(e);
    });
    this._firstNameInput?.addEventListener("blur", this.handleFirstNameBlur);
    this._secondNameInput?.addEventListener("blur", this.handleSecondNameBlur);
    this._displayNameInput?.addEventListener(
      "blur",
      this.handleDisplayNameBlur
    );
    this._loginInput?.addEventListener("blur", this.handleLoginBlur);
    this._emailInput?.addEventListener("blur", this.handleEmailBlur);
    this._phoneInput?.addEventListener("blur", this.handlePhoneBlur);
    this._passwordToggle?.addEventListener("change", this.handlePasswordToggle);
    this._oldPasswordInput?.addEventListener(
      "blur",
      this.handleOldPasswordBlur
    );
    this._newPasswordInput?.addEventListener(
      "blur",
      this.handleNewPasswordBlur
    );
    this._changePhoto?.addEventListener("click", this.handleClickChangePhoto);
    this._avatar?.addEventListener("change", this.handleChangeAvatar);
  };

  unbindElements = () => {
    this._logOut?.removeEventListener(
      "click",
      (e) => void this.handleClickLogout(e)
    );
    this._form?.removeEventListener("submit", (e) => {
      void this.handleSubmit(e);
    });
    this._firstNameInput?.removeEventListener("blur", this.handleFirstNameBlur);
    this._secondNameInput?.removeEventListener(
      "blur",
      this.handleSecondNameBlur
    );
    this._displayNameInput?.removeEventListener(
      "blur",
      this.handleDisplayNameBlur
    );
    this._loginInput?.removeEventListener("blur", this.handleLoginBlur);
    this._emailInput?.removeEventListener("blur", this.handleEmailBlur);
    this._phoneInput?.removeEventListener("blur", this.handlePhoneBlur);
    this._passwordToggle?.removeEventListener(
      "change",
      this.handlePasswordToggle
    );

    this._oldPasswordInput?.removeEventListener(
      "blur",
      this.handleOldPasswordBlur
    );
    this._newPasswordInput?.removeEventListener(
      "blur",
      this.handleNewPasswordBlur
    );
    this._changePhoto?.removeEventListener(
      "click",
      this.handleClickChangePhoto
    );
    this._avatar?.removeEventListener("change", this.handleChangeAvatar);
  };

  componentDidMount() {
    if (!this.props.user) {
      void this.getUserData();
    } else {
      this.renderComponent();
      this.findElements();
      this.bindElements();
    }
  }
}

const mapStateToProps = (state: Indexed) => {
  return {
    user: state.user as UserData | undefined,
  };
};

export const ConnectedUserSettings = connect(mapStateToProps)(UserSettings);
