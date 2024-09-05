# HamonJs
A simple and lightweight JavaScript framework for building web applications.

## Installation
Clone the repository and run the following commands:
```bash
npm ci
npm run dev
```
## Usage
Import vFw dir in your project root directory and include the following script in your html file:
```html
<html lang="en">
  <header>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Framework</title>
  </header>
  <body>
    <div id="root"></div>
    <!-- Ensure this div is empty or contains valid content -->

    <script type="module" src="index.js"></script>
  </body>
</html>
```
Create index.tsx file in your project root directory and include the following code: (This is a simple todo app)
```typescript
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
      target.style.textDecoration = "line-through"; // will be overwritten by createReactiveElement (Doesn't work)
      return;
    }
    target.style.textDecoration = "line-through"; // Same as above (Not working!)

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
```
Then run this command:
```bash
npm run dev
# if it did not work, then run these:
tsc # for compiling ts to js
vite
```
if vite didn't start then you might need to manually install it and set the path for vite.

## Features
### Reactivity
HamonJs uses Fine Grained Reactivity to to make the system reactive. using these two functions:
```typescript
function createSignal<T>(initialValue?: T): [Getter<T>, Setter<T>]
function createEffect(fn: (() => void) | null)
```
### JSX
HamonJs uses JSX to create elements. It uses a custom JSX pragma to create reactive elements.
```typescript
function createReactiveElement(
  tag: string,
  props: Record<string, any>,
  ...children: any[]
): HTMLElement
```
### Components
HamonJs uses components to create reusable elements. It uses a simple function to create components.
Example:
```typescript
function Checkbox(
  props: { 
    Checked: boolean, 
    OnChange: (index: number, e: Event) => void, index: number }
): HTMLElement
```
However you cannot insert as a component in the JSX. You have to call it as a function. (Full component support might be added in the future)

## Notes
This is a simple framework and is not production ready. It is still in development and is not recommended for production use.

## Known Issues
- Reflecting the example above you might have noticed that the Checkbox component is not a component but a function. This is because the framework does not support components yet. This is a workaround to create reusable elements. This will be fixed in the future.
```typescript
<Checkbox /> // This will not work
Checkbox() // This will work
```
- Examine the following code:
```typescript
<div>{() => `count: ${todos()?.length.toString()}`}</div>

// you cannot write it like like below:
<div>count: {todos()?.length.toString()}</div>

/*
  This is because the createReactiveElement will 
  overwrite whole <div> to update todos, 
  this is a workaround to show count text, 
  (inserting the whole children as one function as one child)
*/

/* if otherwise you want to show only count text 
  without the workaround, you can do this:
*/
<div>{todos}</div>
// todos() is a getter function and will update whole <div> when called.
```
- Cannot write `styles = {{ color: "red" }}` in JSX.

## Roadmap
- [x] Fine Grained Reactivity
- [x] JSX
- [ ] Components
- [ ] Router
- [x] State Management
- [ ] Server Side Rendering
- [ ] Documentation
- [ ] Testing
- [ ] Production Ready
- [ ] Performance Optimization
- [ ] Code Splitting
- [ ] Tree Shaking
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
## License
MIT
