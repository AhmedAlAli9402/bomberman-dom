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
            moveBomberman(directions[e.key], 3);
        } else if (e.key === 'x') {
            dropBomb();
        }
    }
}

function moveBomberman(direction, id) {
    id = 3
    const bomberman = document.querySelector(`.bomberman${players[id].color}GoingUp, .bomberman${players[id].color}GoingRight, .bomberman${players[id].color}GoingDown, .bomberman${players[id].color}GoingLeft`);
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

    if (nextSquare && (!nextSquare.classList.length || powerUps.includes(nextSquare.classList[0].split('PowerUp')[0]))) {
        if (nextSquare.classList[0]){
            AddPowerUpToPlayer(nextSquare.classList[0].split('PowerUp')[0], id);
        }
        console.log(players[id].powerUp);
        nextSquare.className = `bomberman${players[id].color}Going${capitalize(direction)}`;
        bomberman.classList.remove(bombermanClass);
        keyStillDown = true;
    }
}

export function setKeyUp() {
    keyStillDown = false;
}

function dropBomb(id) {
    if (bombDropped) return;
    id = 3
    const bomberman = document.querySelector(`.bomberman${players[id].color}GoingUp, .bomberman${players[id].color}GoingRight, .bomberman${players[id].color}GoingDown, .bomberman${players[id].color}GoingLeft`);
    console.log(bomberman);
    if (!bomberman) return;

    const bombermanIndex = availableSquares.indexOf(bomberman);
    if (players[id].powerUp === 'powerBomb') {
        availableSquares[bombermanIndex].classList.add('powerBomb');
    } else {
    availableSquares[bombermanIndex].classList.add('bomb');
    }
    bombDropped = true;

    setTimeout(() => {
        breakWall();
        bombDropped = false;
    }, 3000);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function AddPowerUpToPlayer(powerUp, id) {
    if (powerUp) {
        players[id].powerUp = powerUp;
        setTimeout(() => players[id].powerUp = '', 30000);
    }
}