// framework/framework.js
import { createReactiveElement as DOM } from './rElement.js';
import { Router } from './router.js';
import { createSignal as State } from './signals.js';

export const MyFramework = {
    DOM,
    Router,
    State,
};
