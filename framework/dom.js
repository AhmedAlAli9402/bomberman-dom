class MyDOM {
    createElement({ tag, attrs = {}, children = [] }) {
        // try {
            // Create the DOM element using the provided tag
            const element = document.createElement(tag);

            // Set attributes
            // Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));

            // Set attributes and properties on the element
            for (let key in attrs) {
                if (key.startsWith('on')) {
                    // Handle event attrs (e.g., 'onclick') by adding event listeners
                    element.addEventListener(key.substring(2).toLowerCase(), attrs[key]);
                } else if (key in element) {
                    // Handle properties that are also attrs (e.g., 'value', 'checked')
                    element[key] = attrs[key];
                } else {
                    // Set other attrs (e.g., 'class', 'id')
                    element.setAttribute(key, attrs[key]);
                }
            }

            // Handle children - Ensure it’s an array or convert single strings/nodes to an array
            if (!Array.isArray(children)) {
                children = [children]; // Convert non-array children to an array
            }

            // Append children to the element
            children.forEach(child => {
                // Check if child is a string (text node) or an element object
                if (typeof child === 'string' || typeof child === 'number') {
                    element.appendChild(document.createTextNode(child));
                } else if (child instanceof HTMLElement) {
                    element.appendChild(child);
                } else {
                    element.appendChild(this.createElement(child));
                }
            });

            return element;
        // } catch (error) {
        //     console.error("Error in createElement:", error);
        // }
    }

    render(element, container) {
        container.innerHTML = '';
        container.appendChild(element);
    }
}

export const DOM = new MyDOM();
