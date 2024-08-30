class MyEvents {
    constructor() {
        this.events = {};
    }

    addEvent(element, event, handler) {
        if (!this.events[event]) {
            this.events[event] = [];
            document.addEventListener(event, this.handleEvent.bind(this));
        }
        this.events[event].push({ element, handler });
    }

    handleEvent(e) {
        const { type, target } = e;
        if (this.events[type]) {
            this.events[type].forEach(({ element, handler }) => {
                if (element.contains(target)) {
                    handler(e);
                }
            });
        }
    }
}

export const Events = new MyEvents();
