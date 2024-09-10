// structure/bombermanMoves.js
import { availableSquares, deinitializePlayer } from './buildGame.js';
import { width, height, game, powerUps } from './model.js';
import { MyFramework } from '../vFw/framework.js';
import { sendBombExplosion } from '../app.js';

let players = game.players;

export function changeDirection(e, id) {
    console.log(e, id)
    if (!players[id].keyStillDown || (players[id].powerUp === "skate" && players[id].keyStillDownForSkate < 4)) {
        const directions = {
            'ArrowUp': 'up',
            'ArrowRight': 'right',
            'ArrowDown': 'down',
            'ArrowLeft': 'left'
        };

        if (directions[e]) {
            moveBomberman(directions[e], id);
        } else if (e === 'x') {
            dropBomb(id);
        }
    }
}

function moveBomberman(direction, id) {
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

    if (nextSquare && (!nextSquare.classList.length || powerUps.includes(nextSquare.classList[0]))) {
        if (powerUps.includes(nextSquare.classList[0])){
            AddPowerUpToPlayer(nextSquare.classList[0], id);
        }
        nextSquare.className = `bomberman${players[id].color}Going${capitalize(direction)}`;
        bomberman.classList.remove(bombermanClass);
        players[id].keyStillDown = true;
        if (players[id].powerUp === 'skate') {
            players[id].keyStillDownForSkate++
    } else {
        players[id].keyStillDownForSkate = 0
    }
}
}

export function setKeyUp(id) {
    
    players[id].keyStillDownForSkate = 0;
    players[id].keyStillDown = false;
}

function dropBomb(id) {
    if ((players[id].bombDropped >= 1 && players[id].powerUp !=="extraBomb") || (players[id].bombDropped >= 2 && players[id].powerUp === "extraBomb")) return;
    const bomberman = document.querySelector(`.bomberman${players[id].color}GoingUp, .bomberman${players[id].color}GoingRight, .bomberman${players[id].color}GoingDown, .bomberman${players[id].color}GoingLeft`);
    if (!bomberman) return;

    const bombermanIndex = availableSquares.indexOf(bomberman);
    players[id].bombDropped++
    if (players[id].powerUp === 'powerBomb') {
        availableSquares[bombermanIndex].classList.add('powerBombDropped');
    } else {
    availableSquares[bombermanIndex].classList.add('bomb');
}
    setTimeout(() => {
        sendBombExplosion(bombermanIndex)
        players[id].bombDropped--;
    }, 3000);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function AddPowerUpToPlayer(powerUp, id) {
    if (powerUp) {
        players[id].powerUp = powerUp;
        setTimeout(() => {players[id].powerUp = ''}, 20000);
    }
}

export function playerGameOver(){
    const gameGrid = document.getElementById('gameGrid');
    // Display "Game Over" message
    deinitializePlayer();
        const gameOver = MyFramework.DOM('h1', { class: 'game-over' }, 'Game Over!');
        gameGrid.appendChild(gameOver);
}