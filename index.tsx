import { createEffect, createSignal } from "./vFw/signals.js";
import { createReactiveElement } from "./vFw/rElement.js";
import { Checkbox } from "./components/checkbox.js";

export const container = document.getElementById("root");


function Main() {

  return (
    <div>Bomberman</div>
  )
}

if (container) {
  container.appendChild(Main());
}
