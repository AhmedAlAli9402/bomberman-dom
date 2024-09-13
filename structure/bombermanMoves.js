// structure/bombermanMoves.js
import { availableSquares } from './buildGame.js';
import { width, height, game, powerUps } from './model.js';
import { MyFramework } from '../vFw/framework.js';
import { sendBombExplosion } from '../app.js';
import { breakWall } from './gameEvents.js';

const players = game.players;
let powerUpTimeOut;

const directionMap = {
    'ArrowUp': { direction: 'up', offset: -width, transform: 'translateY(-100%)' },
    'ArrowRight': { direction: 'right', offset: 1, transform: 'translateX(100%)' },
    'ArrowDown': { direction: 'down', offset: width, transform: 'translateY(100%)' },
    'ArrowLeft': { direction: 'left', offset: -1, transform: 'translateX(-100%)' }
};

export function changeDirection(e, id) {
    const player = players[id];
    if (!player.keyStillDown || (player.powerUp === "skate" && player.keyStillDownForSkate < 4)) {
        if (directionMap[e]) {
            moveBomberman(directionMap[e].direction, id);
        } else if (e === 'x') {
            dropBomb(id);
        }
    }
}

function moveBomberman(direction, id) {
    const player = players[id];
    const bomberman = document.querySelector(`.bomberman${player.color}GoingUp, .bomberman${player.color}GoingRight, .bomberman${player.color}GoingDown, .bomberman${player.color}GoingLeft`);
    if (!bomberman) return;

    const bombermanClass = bomberman.classList[0].replace(' bomb', '');
    const bombermanIndex = availableSquares.indexOf(bomberman);
    const newIndex = bombermanIndex + directionMap[`Arrow${direction.charAt(0).toUpperCase() + direction.slice(1)}`].offset;
    const nextSquare = availableSquares[newIndex];

    if (nextSquare && (!nextSquare.classList.length || powerUps.includes(nextSquare.classList[0]))) {
        if (powerUps.includes(nextSquare.classList[0])) {
            addPowerUpToPlayer(nextSquare.classList[0], id);
        }
        const transform = directionMap[`Arrow${direction.charAt(0).toUpperCase() + direction.slice(1)}`].transform;
        bomberman.style.transform = transform;
        bomberman.style.transition = 'transform 0.002s';
        
        setTimeout(() => {
            nextSquare.className = `bomberman${player.color}Going${direction.charAt(0).toUpperCase() + direction.slice(1)}`;
            bomberman.classList.remove(bombermanClass);
            bomberman.style.transform = '';
            bomberman.style.transition = '';
        }, 2);

        player.keyStillDown = true;
        player.keyStillDownForSkate = player.powerUp === 'skate' ? player.keyStillDownForSkate + 1 : 0;
    }
}

export function setKeyUp(id) {
    const player = players[id];
    player.keyStillDownForSkate = 0;
    player.keyStillDown = false;
}

function dropBomb(id) {
    const player = players[id];
    if ((player.bombDropped >= 1 && player.powerUp !== "extraBomb") || (player.bombDropped >= 2 && player.powerUp === "extraBomb")) return;

    const bomberman = document.querySelector(`.bomberman${player.color}GoingUp, .bomberman${player.color}GoingRight, .bomberman${player.color}GoingDown, .bomberman${player.color}GoingLeft`);
    if (!bomberman) return;

    const bombermanIndex = availableSquares.indexOf(bomberman);
    console.log('bombermanIndex', bombermanIndex);
    player.bombDropped++;
    const bombClass = player.powerUp === 'powerBomb' ? 'powerBombDropped' : 'bomb';
    availableSquares[bombermanIndex].classList.add(bombClass);
    console.log('bombClass', bombClass);
    console.log('availableSquares[bombermanIndex].classList', availableSquares[bombermanIndex].classList);


    setTimeout(() => {
        player.bombDropped--;
        availableSquares[bombermanIndex].classList.remove(bombClass);
        availableSquares[bombermanIndex].classList.add('explosion');
        const directions = breakWall(bombermanIndex,player.powerUp);
        sendBombExplosion(bombermanIndex, directions);
        
        setTimeout(() => {
            availableSquares[bombermanIndex].classList.remove('explosion');
        }, 200);
    }, 3000);
}

function addPowerUpToPlayer(powerUp, id) {
    if (powerUp) {
        players[id].powerUp = powerUp;
        clearTimeout(powerUpTimeOut);
        powerUpTimeOut = setTimeout(() => { players[id].powerUp = ''; }, 20000);
    }
}

export function playerGameOver() {
    const gameGrid = document.getElementById('gameGrid');
    const gameOver = MyFramework.DOM('h1', { class: 'game-over' }, 'Game Over!');
    gameGrid.appendChild(gameOver);
}