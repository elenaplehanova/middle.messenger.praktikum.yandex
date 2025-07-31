import "./Navbar.scss";
import template from "./Navbar.hbs?raw";
import { Component } from "@/services/Component";
import { compile } from "handlebars";
import { App } from "@/components/App";
import RoutePaths from "@/services/Router/RoutePaths";

interface NavbarProps {
  [key: string]: unknown;
}

export class Navbar extends Component<NavbarProps> {
  constructor(props: NavbarProps = {}) {
    super("template", props);
  }

  render() {
    const currentPage = window.location.pathname;
    return compile(template)({
      ...this.props,
      currentPage,
      pages: [
        { path: RoutePaths.Messenger, name: "Messenger" },
        { path: RoutePaths.SignIn, name: "Sign in" },
        { path: RoutePaths.SignUp, name: "Sign up" },
        { path: RoutePaths.UserSettings, name: "User settings" },
        { path: RoutePaths.Page500, name: "500" },
        { path: RoutePaths.NotFound, name: "404" },
      ],
    });
  }

  handleClick = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    const path = target.getAttribute("data-link");
    if (path) {
      App.getRouter().go(path);
    }
  };

  componentDidMount(): void {
    const links = this.element?.querySelectorAll("a[data-link]");
    links?.forEach((link) => {
      link.addEventListener("click", (e) => this.handleClick(e));
    });
  }
}
