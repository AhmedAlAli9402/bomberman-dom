import { createReactiveElement } from "./vFw/rElement.js";
export const container = document.getElementById("root");
function Main() {
    return (createReactiveElement("div", null, "Bomberman"));
}
if (container) {
    container.appendChild(Main());
}
