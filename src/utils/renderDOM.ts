import type { Component } from "@/services/Component";

export function render(query: string, component: Component): HTMLElement {
  const root = document.querySelector(query);

  if (!root) {
    throw new Error(`The element was not found by the selector: ${query}`);
  }

  const content = component.getContent();
  if (!content) {
    throw new Error("The component does not return the content");
  }

  root.appendChild(content);

  component.dispatchComponentDidMount();

  return root as HTMLElement;
}
