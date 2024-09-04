// structure/bombermanMoves.js
import { availableSquares } from './buildGame.js';
import { breakWall } from './gameEvents.js';
import { width, height, players, powerUps } from './model.js';

let keyStillDown = false;
let bombDropped = false;

export function changeDirection(e) {
    if (!keyStillDown) {
        const directions = {
            'ArrowUp': 'up',
            'ArrowRight': 'right',
            'ArrowDown': 'down',
            'ArrowLeft': 'left'
        };

        if (directions[e.key]) {
            moveBomberman(directions[e.key]);
        } else if (e.key === 'x') {
            dropBomb();
        }
    }
}

function moveBomberman(direction) {
    const bomberman = document.querySelector('.bombermanGoingUp, .bombermanGoingRight, .bombermanGoingDown, .bombermanGoingLeft');
    if (!bomberman) return;

    const bombermanClass = bomberman.classList[0].replace(' bomb', '');
    const bombermanIndex = availableSquares.indexOf(bomberman);

    const directionMap = {
        'up': -width,
        'right': 1,
        'down': width,
        'left': -1
    };

    const newIndex = bombermanIndex + directionMap[direction];
    const nextSquare = availableSquares[newIndex];

    if (nextSquare && (!nextSquare.classList.length || powerUps.includes(nextSquare.classList[0]))) {
        players[1].powerUp = nextSquare.classList[0] || '';
        nextSquare.className = `bombermanGoing${capitalize(direction)}`;
        bomberman.classList.remove(bombermanClass);
        keyStillDown = true;
    }
}

export function setKeyUp() {
    keyStillDown = false;
}

function dropBomb() {
    if (bombDropped) return;

    const bomberman = document.querySelector('.bombermanGoingUp, .bombermanGoingRight, .bombermanGoingDown, .bombermanGoingLeft');
    if (!bomberman) return;

    const bombermanIndex = availableSquares.indexOf(bomberman);
    availableSquares[bombermanIndex].classList.add('bomb');
    bombDropped = true;

    setTimeout(() => {
        breakWall();
        bombDropped = false;
    }, 3000);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
