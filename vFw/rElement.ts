import { createEffect } from "./signals.js";

export interface ReactiveElementProps {
  [key: string]: any;
}

export function createReactiveElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: ReactiveElementProps,
  ...children: Array<string | Node | (() => string | Node | Array<Node>)>
): HTMLElementTagNameMap[K] {


  // Initialize props if not provided
  if (props == null || props === undefined) {
    props = {};
  }

  // Create the element
  const element = document.createElement(tag);

  // Set element attributes and event listeners
  Object.entries(props).forEach(([key, value]: [string, any]) => {
    if (typeof value === "function") {
      (element as any)[key.toLowerCase()] = value;
    } else {
      element.setAttribute(key, String(value));
    }
  });

  // Append children elements or handle reactive content
  children.forEach((child) => {
    if (typeof child === "function") {
      createEffect(() => {
        const result = child();
        if (typeof result === "string" || typeof result === "number") {
          // If the result is a string or number, update the textContent
          element.textContent = result.toString();
        } else if (Array.isArray(result)) {
          console.log("result", result);
          // If the result is an array, append each Node individually
          element.innerHTML = ""; // Clear existing content
          result.forEach((node) => {
            if (node instanceof Node) {
              element.appendChild(node);
            }
          });
        } else if (result instanceof Node) {
          // If the result is a Node, append it
          element.innerHTML = ""; // Clear existing content
          element.appendChild(result);
        }
      });
    } else if (typeof child === "string") {
      // Append plain strings as text nodes
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      // Append Node elements directly
      element.appendChild(child);
    }
  });

  return element;
}
