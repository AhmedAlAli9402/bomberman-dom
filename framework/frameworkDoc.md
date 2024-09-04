
---

# MyFramework Documentation

## Overview

**MyFramework** is a lightweight JavaScript framework designed to simplify DOM manipulation, routing, state management, and event handling. It provides a clean and intuitive API for building interactive web applications with minimal clean code.

## Features

1. **DOM Abstraction**: Simplify element creation, nesting, and manipulation.
2. **Routing System**: Manage application navigation using hash-based routing.
3. **State Management**: Track and update application state in a centralized manner.
4. **Event Handling**: Add and manage event listeners with ease.

## Getting Started

<details>
<summary>Installation:</summary>

```javascript
// Include MyFramework in your project
import { MyFramework } from 'path_to_framework';
const { DOM, Router, State, Events } = MyFramework;
```

#### Basic Setup

To start using the framework, initialize the core modules you need. Typically, you’ll initialize the `State`, `Router`, and set up event listeners using `Events`.

```javascript
State.setState({
    todos: [],
    filter: 'all'
});

Router.navigate('/');
```
</details>


<details>
<summary>Code examples and explanations on how to:</summary>

#### 1. Creating an Element

To create a new element, use the `DOM.createElement` method. You can specify the tag, attributes, and children elements.

**Example:**

```javascript
const div = DOM.createElement('div', {
    attrs: { class: 'container' },
    children: [
        DOM.createElement('h1', { children: ['Welcome'] }),
        DOM.createElement('p', { children: ['Hello, World!'] })
    ]
});
```

#### 2. Adding an Event

Attach event listeners to elements using the `Events.addEvent` method. You need to specify the target element, event type, and handler function.

**Example:**

```javascript
const button = DOM.getById('myButton');
Events.addEvent(button, 'click', () => {
    console.log('Button clicked!');
});
```

#### 3. Nesting Elements

Elements can be nested within each other by specifying children in the `DOM.createElement` method.

**Example:**

```javascript
const nestedDiv = DOM.createElement('div', {
    children: [
        DOM.createElement('p', { children: ['This is a nested paragraph.'] }),
        DOM.createElement('ul', {
            children: [
                DOM.createElement('li', { children: ['Item 1'] }),
                DOM.createElement('li', { children: ['Item 2'] })
            ]
        })
    ]
});
```

#### 4. Adding Attributes to an Element

Attributes can be added to elements using the `attrs` property in the `DOM.createElement` method.

**Example:**

```javascript
const link = DOM.createElement('a', {
    attrs: {
        href: 'https://example.com',
        target: '_blank',
        id: 'myLink'
    },
    children: ['Visit Example']
});
```
</details>



## Advanced Features


<details>
<summary>Routing:</summary>

**MyFramework** supports hash-based routing through the `Router` object.

**Example:**

```javascript
Router.addRoute('/', () => {
    State.setState({ filter: 'all' });
});

Router.addRoute('/active', () => {
    State.setState({ filter: 'active' });
});

Router.addRoute('/completed', () => {
    State.setState({ filter: 'completed' });
});
```

Navigate programmatically using the `Router.navigate` method:

```javascript
Router.navigate('/active');
```
</details>

<details>
<summary>State Management:</summary>

Manage application state using the `State` object.

**Example:**

```javascript
State.setState({ todos: [] });
const state = State.getState();
```

Subscribe to state changes:

```javascript
State.subscribe(() => {
    console.log('State updated:', State.getState());
});
```
</details>

## Design Choices

<details>
<summary>Design Choices:</summary>

#### DOM Abstraction

**Why**: Simplifies the process of creating and managing elements, making it easier to build complex UIs without dealing with raw DOM APIs.

**How**: Elements are created using a consistent and intuitive API, allowing for clear and maintainable code.

#### Routing

**Why**: Enables navigation within single-page applications (SPAs) using hash-based URLs, providing a simple way to handle different views.

**How**: Routes are defined with corresponding callback functions that update the application state and render the appropriate view.

#### State Management

**Why**: Centralizes application state, making it easier to track and update state consistently across different parts of the application.

**How**: State changes are managed through a centralized `State` object, which can be subscribed to and updated as needed.

#### Event Handling

**Why**: Simplifies the process of adding and managing event listeners, ensuring that events are handled in a clean and consistent manner.

**How**: Event listeners are added using the `Events.addEvent` method, allowing for easy attachment and detachment of handlers.
</details>


## API Reference
<details>
<summary>API Reference:</summary>

**DOM Module:**
- `createElement({ tag, attrs, children })`
  - **tag**: String representing the HTML tag.
  - **attrs**: Object containing attributes and event handlers.
  - **children**: Array of child elements or text.

- `render(element, container)`
  - **element**: The element to render.
  - **container**: The DOM node where the element will be rendered.

**State Module:**
- `setState(newState)`
  - **newState**: Object representing the new state.

- `getState()`
  - Returns the current state object.

- `subscribe(callback)`
  - **callback**: Function to be called when state changes.

**Events Module:**
- `addEvent(element, eventType, callback)`
  - **element**: The target DOM element.
  - **eventType**: Type of event (e.g., 'click', 'keydown').
  - **callback**: Function to execute when the event occurs.

- `removeEvent(element, eventType, callback)`
  - **element**: The target DOM element.
  - **eventType**: Type of event.
  - **callback**: The function to remove.

**Router Module:**
- `addRoute(path, callback)`
  - **path**: The URL path to match.
  - **callback**: Function to execute when the route matches.

- `navigate(path)`
  - **path**: The path to navigate to.

</details>

## Best Practices

- **Modular Code**: Keep your code modular by separating logic into functions and components.
- **State Management**: Use the State module effectively to manage global state, reducing the need for direct DOM manipulation.
- **Event Delegation**: Use event delegation for handling events on dynamically created elements.



## Conclusion

**MyFramework** aims to streamline web development by providing a clear and efficient API for common tasks. By following this documentation, you should be able to create, manage, and interact with elements in a straightforward manner.

For additional information and examples, refer to the source code provided.

---

