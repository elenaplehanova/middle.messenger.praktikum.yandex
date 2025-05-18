import { Component } from "@/services/Component";
import template from "./App.hbs?raw";
import { compile } from "handlebars";
import { SignIn } from "@/pages/SignIn";
import { SignUp } from "@/pages/SignUp";
import { UserSettings } from "@/pages/UserSettings";
import { Messenger } from "@/pages/Messenger";
import { Navbar } from "@components/Navbar";
import { ErrorPage } from "@/pages/ErrorPage";
import { Router } from "@/services/Router";

class Page404 extends ErrorPage {
  constructor() {
    super({ text: "404 Page not found" });
  }
}
class Page500 extends ErrorPage {
  constructor() {
    super({ text: "5** server error..(((" });
  }
}

export class App extends Component {
  private _navbar: Navbar;
  private _router: Router;

  constructor() {
    const initialPath = window.location.pathname;
    const navbar = new Navbar({
      currentPage: initialPath,
    });

    super("template", { navbar });

    this._navbar = navbar;
    this._router = new Router("#router");

    this.setupRouting();
  }

  private setupRouting() {
    this._router
      .use("/", Messenger)
      .use("/sign-in", SignIn)
      .use("/sign-up", SignUp)
      .use("/user-settings", UserSettings)
      .use("/page-500", Page500)
      .use("*", Page404);
  }

  render() {
    return compile(template)(this.props);
  }

  componentDidMount() {
    const navbarPlaceholder = this.element?.querySelector(
      '[data-component="navbar"]'
    );
    if (navbarPlaceholder && this._navbar.getContent()) {
      navbarPlaceholder.replaceWith(this._navbar.getContent()!);
    }
    this._navbar.dispatchComponentDidMount();

    this._router.start();
  }
}
