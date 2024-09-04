// structure/gameEvents.js

import { availableSquares } from './buildGame.js';
import { width, players } from './model.js';

export function breakWall() {
    const bomb = document.querySelector('.bomb');
    const bombIndex = availableSquares.indexOf(bomb);
    const id = Number(bomb.getAttribute('id'));

    explosion(id);
    checkIfPlayerInBlastRadius(id);

    const directions = [-1, 1, width, -width];

    directions.forEach((direction) => {
        const square = availableSquares[id + direction];
        if (square && square.classList.contains('breakableWall')) {
            square.classList.replace('breakableWall', 'breakWall');
            setTimeout(() => square.classList.remove('breakWall'), 500);
        }
    });

    bomb.classList.replace('bomb', 'explosion');
    setTimeout(() => bomb.classList.remove('explosion'), 200);
}

function explosion(id) {
    const directions = {
        'explosionTop': -width,
        'explosionBottom': width,
        'explosionLeft': -1,
        'explosionRight': 1
    };

    Object.entries(directions).forEach(([explosionType, offset]) => {
        const targetSquare = availableSquares[id + offset];
        if (targetSquare && !targetSquare.classList.length) {
            targetSquare.classList.add(explosionType);
            setTimeout(() => targetSquare.classList.remove(explosionType), 200);
        }
    });
}

function checkIfPlayerInBlastRadius(id) {
    const bomberman = document.querySelector('.bombermanGoingUp, .bombermanGoingRight, .bombermanGoingDown, .bombermanGoingLeft');
    const bombermanIndex = availableSquares.indexOf(bomberman);

    if ([id, id - 1, id + 1, id + width, id - width].includes(bombermanIndex)) {
        killPlayer(bomberman);
    }
}

function killPlayer(bomberman) {
    bomberman.classList.add('dead');
    setTimeout(() => bomberman.classList.remove('dead'), 500);
}
