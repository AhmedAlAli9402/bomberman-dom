import { createReactiveElement } from "../vFw/rElement";
export function Checkbox(props) {
    if (props.Checked) {
        return (createReactiveElement("input", { onChange: (e) => props.OnChange(props.index, e), type: "checkbox", checked: true }));
    }
    else {
        return (createReactiveElement("input", { onChange: (e) => props.OnChange(props.index, e), type: "checkbox" }));
    }
}
