import Handlebars from "handlebars";

export function registerHandlebarsHelpers() {
  Handlebars.registerHelper("eq", (a, b) => a === b);
  Handlebars.registerHelper("not", (a) => !a);
}
