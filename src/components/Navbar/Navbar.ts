import "./Navbar.scss";
import template from "./Navbar.hbs?raw";
import { Component } from "@/services/Component";
import { compile } from "handlebars";
import { App } from "@/components/App";
import Store from "@/services/Store/Store";
import { Indexed } from "@/utils/set";
import { connect } from "@/services/Store/Connect";

interface NavbarProps {
  currentPage?: string;
  onNavigate?: (path: string) => void;
  [key: string]: unknown;
}

class Navbar extends Component<NavbarProps> {
  constructor(props: NavbarProps = {}) {
    super("template", props);
  }

  render() {
    return compile(template)({
      ...this.props,
      pages: [
        { path: "/", name: "Messenger" },
        { path: "/sign-in", name: "Sign in" },
        { path: "/sign-up", name: "Sign up" },
        { path: "/page-500", name: "500" },
        { path: "/page-404", name: "404" },
        { path: "/user-settings", name: "User settings" },
      ],
    });
  }

  handleClick(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    const path = target.getAttribute("data-link");
    if (path) {
      Store.set("currentPage", path);
      App.getRouter().go(path);
    }
  }

  componentDidMount(): void {
    const links = this.element?.querySelectorAll("a[data-link]");
    links?.forEach((link) => {
      link.addEventListener("click", (e) => this.handleClick(e));
    });
  }
}

const mapStateToProps = (state: Indexed) => {
  return {
    currentPage: state.currentPage as string | undefined,
  };
};

export const ConnectedNavbar = connect(mapStateToProps)(Navbar);
