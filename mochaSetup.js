import { JSDOM } from "jsdom";

const jsdom = new JSDOM("<body></body>", {
  url: "http://localhost",
});

global.window = jsdom.window;
global.document = jsdom.window.document;
global.FormData = jsdom.window.FormData;
global.HTMLElement = jsdom.window.HTMLElement;
global.MouseEvent = jsdom.window.MouseEvent;
global.location = jsdom.window.location;
