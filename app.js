import buildGame from './structure/buildGame.js';
import { State } from './framework/state.js';

State.subscribe(buildGame);
document.getElementById('app')
buildGame();
