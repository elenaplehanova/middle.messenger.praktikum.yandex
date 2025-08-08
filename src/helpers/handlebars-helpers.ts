import Handlebars from "handlebars";

export function registerHandlebarsHelpers() {
  Handlebars.registerHelper("eq", (a: unknown, b: unknown) => a === b);
  Handlebars.registerHelper("not", (a: unknown) => !a);
}
