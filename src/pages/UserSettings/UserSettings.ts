import "./UserSettings.scss";
import { Button } from "@components/Button";
import template from "./UserSettings.hbs?raw";
import { Component, Props } from "@/services/Component";
import { compile } from "handlebars";
import {
  validateEmail,
  validateLogin,
  validateName,
  validatePassword,
  validatePhone,
} from "@/utils/validation";
import { connect } from "@/services/Store/Connect";
import { Indexed } from "@/utils/set";
import Store from "@/services/Store/Store";
import { AuthApi } from "@/api/AuthApi";
import isEqual from "@/utils/isEqual";
import { App } from "@/components/App";

interface UserData {
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
      // events: {
      //   click: (e: Event) => {
      //     this.handleClickSaveButton(e);
      //   },
      // },
    });
    super("template", { ...props, button });
    this._button = button;
  }

  render() {
    const compiled = compile(template);
    return compiled(this.props);
  }

  renderComponent = () => {
    console.log("update component");

    const placeholder = this.element?.querySelector(
      '[data-component="button"]'
    );
    if (placeholder && this._button.getContent()) {
      placeholder.replaceWith(this._button.getContent()!);

      this.addDOMEvents(this._button, [
        {
          type: "click",
          handler: (e: Event) => {
            e.preventDefault();
            console.log("Button clicked via addDOMEvents");
          },
        },
      ]);
    }
    this._button.dispatchComponentDidMount();
  };

  handleClickSaveButton = (e: Event) => {
    e.preventDefault();
    console.log("Button clicked");
  };

  getUserData = async () => {
    const authApi = new AuthApi();
    const userData = await authApi.getUser();
    if (userData) {
      Store.set("user", { ...userData, isAuth: true });
    }
  };

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

  handleClickLink = async (e: Event) => {
    e.preventDefault();
    const authApi = new AuthApi();
    try {
      await authApi.logout();
      App.getRouter().go("/sign-in");
    } catch (error) {
      console.dir(error);
    }
  };

  addEvent = () => {
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

      this._logOut = this.element.querySelector("#logOut");
      if (this._logOut) {
        this._logOut.addEventListener("click", this.handleClickLink);
      }

      if (this._form) {
        this._form.addEventListener("submit", this.handleSubmit);
      }

      this._firstNameInput?.addEventListener("blur", this.handleFirstNameBlur);
      this._secondNameInput?.addEventListener(
        "blur",
        this.handleSecondNameBlur
      );
      this._displayNameInput?.addEventListener(
        "blur",
        this.handleDisplayNameBlur
      );
      this._loginInput?.addEventListener("blur", this.handleLoginBlur);
      this._emailInput?.addEventListener("blur", this.handleEmailBlur);
      this._phoneInput?.addEventListener("blur", this.handlePhoneBlur);
      this._oldPasswordInput?.addEventListener(
        "blur",
        this.handleOldPasswordBlur
      );
      this._newPasswordInput?.addEventListener(
        "blur",
        this.handleNewPasswordBlur
      );
      this._changePhoto?.addEventListener("click", () => {
        if (this._avatar) {
          this._avatar.click();
        }
      });
      this._avatar?.addEventListener("change", () => {
        if (this._avatar?.files) {
          if (this._avatar?.files?.length > 0) {
            if (this._image) {
              this._image.src = URL.createObjectURL(this._avatar.files[0]);
            }
          }
        }
      });
    }
  };

  componentDidMount() {
    this.addEvent();
    if (!this.props.user) {
      this.getUserData();
    }
  }

  protected componentDidUpdate(
    oldProps: Props<UserSettingsProps>,
    newProps: Props<UserSettingsProps>
  ): boolean {
    const hasChanges = !isEqual(oldProps, newProps);
    if (hasChanges) {
      this.addEvent();
    }
    return hasChanges;
  }
}

const mapStateToProps = (state: Indexed) => {
  return {
    user: state.user as UserData | undefined,
  };
};

export const ConnectedUserSettings = connect(mapStateToProps)(UserSettings);
