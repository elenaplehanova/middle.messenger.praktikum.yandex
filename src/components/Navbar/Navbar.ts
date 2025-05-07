import "./Navbar.scss";
import template from "./Navbar.hbs?raw";
import { Component } from "@/services/Component";
import { compile } from "handlebars";

interface NavbarProps {
  currentPage?: string;
  onNavigate?: (path: string) => void;
}

export class Navbar extends Component {
  constructor(props: NavbarProps = {}) {
    super("template", props);
  }

  handleClick(path: string) {
    return (e: Event) => {
      e.preventDefault();
      this.props.onNavigate?.(path);
    };
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
      handleClick: this.handleClick.bind(this),
    });
  }
}
