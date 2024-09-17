import { availableSquares } from './buildGame.js';
import { width, game, powerUps } from './model.js';
import { sendBombExplosion } from '../app.js';
import { breakWall } from './gameEvents.js';

let powerUpTimeOut;

// Function to convert x, y to a single position index
const positionToIndex = (position, gameGrid) => position.y * gameGrid.width + position.x;

const directionMap = {
    ArrowUp: { offset: -width, transform: 'translateY(-100%)' },
    ArrowRight: { offset: 1, transform: 'translateX(100%)' },
    ArrowDown: { offset: width, transform: 'translateY(100%)' },
    ArrowLeft: { offset: -1, transform: 'translateX(-100%)' }
};

export function moveBomberman(direction, id) {
    const player = game.players[id];
    const bomberman = document.querySelector(`.bomberman${player.color}GoingUp, .bomberman${player.color}GoingRight, .bomberman${player.color}GoingDown, .bomberman${player.color}GoingLeft`);
    if (!bomberman) return;

    const bombermanClass = bomberman.classList[0].replace(' bomb', '');
    const bombermanNextIndex = positionToIndex(player.playerPosition, game.gameGrid);

    const nextSquare = document.querySelectorAll(".grid div")[bombermanNextIndex];
    const classDirection = direction.split('Arrow').slice(1).join('');
    if (nextSquare) {
        // Move the bomberman visually
        const transform = directionMap[direction].transform;
        bomberman.style.transform = transform;
        bomberman.style.transition = 'transform 0.2s'; // Increased duration for visibility

        requestAnimationFrame(() => {
            bomberman.classList.remove(bombermanClass);
            nextSquare.className = `bomberman${player.color}Going${classDirection}`;
            bomberman.style.transform = '';
            bomberman.style.transition = '';
        });

        player.keyStillDown = true;
        player.keyStillDownForSkate = player.powerUp === 'skate' ? player.keyStillDownForSkate + 1 : 0;
    }
}

export function setKeyUp(id) {
    const players = game.players;

    const player = players[id];
    player.keyStillDownForSkate = 0;
    player.keyStillDown = false;
}

function dropBomb(id) {
    const players = game.players;

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
    const players = game.players;

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
