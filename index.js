import { createSignal } from "./vFw/signals.js";
import { createReactiveElement } from "./vFw/rElement.js";
import "./styles.css";
import { Checkbox } from "./components/checkbox.js";
export const container = document.getElementById("root");
function TodoApp() {
    const [todos, setTodos] = createSignal([]);
    const addTodo = (event) => {
        if (event.key === "Enter") {
            let todoInput = document.getElementById("todoInput");
            if (!todoInput?.value || !todoInput.value.trim()) {
                todoInput.value = "";
                return;
            }
            setTodos([
                ...(todos() || []),
                { note: todoInput?.value, isCompleted: false },
            ]);
            todoInput.value = "";
        }
        console.log(todos());
    };
    const markCompleteCheckbox = (index, e) => {
        console.log(e);
        const target = e.target;
        const todos_temp = todos();
        if (!todos_temp)
            return;
        if (target?.checked) {
            todos_temp[index].isCompleted = true;
            setTodos([...todos_temp]);
            target.style.textDecoration = "line-through";
            return;
        }
        target.style.textDecoration = "line-through";
        todos_temp[index].isCompleted = false;
        setTodos([...todos_temp]);
    };
    const deleteTodo = (index) => {
        setTodos(todos().filter((_, i) => i !== index));
    };
    return (createReactiveElement("div", { onkeydown: addTodo },
        createReactiveElement("h1", { class: "logo" }, "todos"),
        createReactiveElement("div", null, () => `count: ${todos()?.length.toString()}`),
        createReactiveElement("input", { class: "inputTextNote", type: "text", id: "todoInput", placeholder: "Add a todo" }),
        createReactiveElement("button", { class: "addNoteButton", onclick: addTodo }, "Add"),
        createReactiveElement("ul", { class: "notesList" }, () => todos()?.map((todo, index) => (createReactiveElement("li", { class: "note", key: index },
            () => Checkbox({
                Checked: todo.isCompleted,
                OnChange: (index, e) => markCompleteCheckbox(index, e),
                index: index,
            }),
            " ",
            todo.isCompleted ?
                createReactiveElement("p", { class: "todoText line-Through" }, todo.note) :
                createReactiveElement("p", { class: "todoText" }, todo.note),
            " ",
            createReactiveElement("button", { class: "deleteNoteButton", onClick: () => deleteTodo(index) }, "Delete")))))));
}
if (container) {
    container.appendChild(TodoApp());
}
