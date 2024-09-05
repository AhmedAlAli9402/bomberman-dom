import { createReactiveElement } from "../vFw/rElement";

interface CheckboxProps {
  Checked: boolean;
  OnChange: Function;
  index: number;
}
export function Checkbox(props: CheckboxProps) {
  if (props.Checked) {
    return (
      <input
        onChange={(e: Event) => props.OnChange(props.index, e)}
        type="checkbox"
        checked
      />
    );
  } else {
    return (
      <input
        onChange={(e: Event) => props.OnChange(props.index, e)}
        type="checkbox"
      />
    );
  }
}
