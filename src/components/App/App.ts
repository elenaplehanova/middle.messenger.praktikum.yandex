import { Component } from "@/services/Component";
import template from "./App.hbs?raw";
import { compile } from "handlebars";
import { SignIn } from "@/pages/SignIn";
import { SignUp } from "@/pages/SignUp";
import { UserSettings } from "@/pages/UserSettings";
import { Messenger } from "@/pages/Messenger";
import { Navbar } from "@components/Navbar";
import { ErrorPage } from "@/pages/ErrorPage";
import { Router } from "@/services/Router/Router";
import RoutePaths from "@/services/Router/RoutePaths";

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
  private static _router: Router;

  constructor() {
    const navbar = new Navbar({});
    super("template", { navbar });
    this._navbar = navbar;
  }

  private setupRouting() {
    App._router
      .use(RoutePaths.Messenger, Messenger)
      .use(RoutePaths.SignIn, SignIn)
      .use(RoutePaths.SignUp, SignUp)
      .use(RoutePaths.UserSettings, UserSettings)
      .use(RoutePaths.Page500, Page500)
      .use(RoutePaths.NotFound, Page404)
      .start();
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

    if (!App._router) {
      App._router = new Router("#router");
      this.setupRouting();
    }
  }

  public static getRouter(): Router {
    return App._router;
  }
}
