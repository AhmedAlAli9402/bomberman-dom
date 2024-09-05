import { createEffect, createSignal } from "./vFw/signals.js";
import { createReactiveElement } from "./vFw/rElement.js";
import "./styles.css";
import { Checkbox } from "./components/checkbox.js";

export const container = document.getElementById("root");

interface Todo {
  note: string;
  isCompleted: boolean;
}

function TodoApp() {
  const [todos, setTodos] = createSignal<Todo[]>([]);

  const addTodo = (event: { key: string }) => {
    if (event.key === "Enter") {
      let todoInput = document.getElementById("todoInput") as HTMLInputElement;
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

  const markCompleteCheckbox = (index: number, e: Event) => {
    console.log(e);
    const target = e.target as HTMLInputElement;
    const todos_temp = todos();
    if (!todos_temp) return;
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
  const deleteTodo = (index: number) => {
    setTodos(todos()!.filter((_, i) => i !== index));
  };

  return (
    <div onkeydown={addTodo}>
      <h1 class={"logo"}>todos</h1>
      <div>{() => `count: ${todos()?.length.toString()}`}</div>
      <input
        class={"inputTextNote"}
        type="text"
        id="todoInput"
        placeholder="Add a todo"
      />
      <button class={"addNoteButton"} onclick={addTodo}>
        Add
      </button>
      <ul class={"notesList"}>
        {() =>
          todos()?.map((todo, index) => (
            <li class={"note"} key={index}>
              {() =>
                Checkbox({
                  Checked: todo.isCompleted,
                  OnChange: (index: number, e: Event) =>
                    markCompleteCheckbox(index, e),
                  index: index,
                })
              }{" "}
              {
                todo.isCompleted ?
                  <p class={"todoText line-Through"}>{todo.note}</p> :
                  <p class={"todoText"}>{todo.note}</p>}{" "}
              <button
                class={"deleteNoteButton"}
                onClick={() => deleteTodo(index)}
              >
                Delete
              </button>
            </li>
          ))
        }
      </ul>
    </div>
  );
}

if (container) {
  container.appendChild(TodoApp());
}
