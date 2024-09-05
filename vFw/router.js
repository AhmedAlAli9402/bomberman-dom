class MyRouter {
    constructor() {
        this.routes = {};
        window.addEventListener('hashchange', () => this.handleRouteChange());
    }

    addRoute(path, callback) {
        this.routes[path] = callback;
    }

    handleRouteChange() {
        const path = window.location.hash.slice(1);
        if (this.routes[path]) {
            this.routes[path]();
        } else if (this.routes['404']) {
            this.routes['404']();
        }
    }

    navigate(path) {
        window.location.hash = path;
    }
}

export const Router = new MyRouter();
