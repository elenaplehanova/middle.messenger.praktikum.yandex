import "@styles/global.scss";
import "@styles/main.scss";
import { render as renderDom } from "@/utils/renderDOM";
import { App } from "@components/App";
import { registerHandlebarsHelpers } from "./helpers/handlebars-helpers";

registerHandlebarsHelpers();

const app = new App();

renderDom("#app", app);
