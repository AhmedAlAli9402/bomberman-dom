// framework/framework.js
import { createReactiveElement as DOM } from './rElement.js';
import { Router } from './router.js';
import { createSignal as State } from './signals.js';
// import { Events } from './events.js';

export const MyFramework = {
    DOM,
    Router,
    State,
    // Events
};
