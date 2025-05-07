import { Component } from "@/services/Component";
import appTemplate from "./App.hbs?raw";
import { compile } from "handlebars";
import { SignIn } from "@/pages/SignIn";
import { SignUp } from "@/pages/SignUp";
import { UserSettings } from "@/pages/UserSettings";
import { Messenger } from "@/pages/Messenger";
import { Navbar } from "@components/Navbar";
import { ErrorPage } from "@/pages/ErrorPage";

export class App extends Component {
  private _navbar: Navbar;
  private _currentPageComponent: Component | null = null;

  constructor() {
    const initialPath = window.location.pathname;
    const navbar = new Navbar({
      currentPage: initialPath,
    });

    super("template", { navbar });

    this._navbar = navbar;
    this.handlePageChange(initialPath);
  }

  private handlePageChange(path: string) {
    const page404 = new ErrorPage({ text: "404 Page not found" });
    const page500 = new ErrorPage({ text: "5** server error..(((" });

    switch (path) {
      case "/":
        this._currentPageComponent = new Messenger();
        break;
      case "/sign-in":
        this._currentPageComponent = new SignIn();
        break;
      case "/sign-up":
        this._currentPageComponent = new SignUp();
        break;
      case "/user-settings":
        this._currentPageComponent = new UserSettings();
        break;
      case "/page-500":
        this._currentPageComponent = page500;
        break;
      case "/page-404":
        this._currentPageComponent = page404;
        break;
      default:
        this._currentPageComponent = page404;
        break;
    }

    this._navbar.setProps({ currentPage: path });

    this.updatePageContent();
  }

  private updatePageContent() {
    const pagePlaceholder = this.element?.querySelector(
      '[data-component="page"]'
    );
    if (pagePlaceholder && this._currentPageComponent?.getContent()) {
      pagePlaceholder.replaceWith(this._currentPageComponent.getContent()!);
      this._currentPageComponent.dispatchComponentDidMount();
    }
  }

  render() {
    return compile(appTemplate)(this.props);
  }

  componentDidMount() {
    const navbarPlaceholder = this.element?.querySelector(
      '[data-component="navbar"]'
    );
    if (navbarPlaceholder && this._navbar.getContent()) {
      navbarPlaceholder.replaceWith(this._navbar.getContent()!);
    }
    this._navbar.dispatchComponentDidMount();

    this.updatePageContent();
  }
}
