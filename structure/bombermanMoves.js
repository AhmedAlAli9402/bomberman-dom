// structure/bombermanMoves.js
import { availableSquares } from './buildGame.js';
import { breakWall } from './gameEvents.js';
import { width, height, players, powerUps } from './model.js';

let keyStillDown = false;
let bombDropped = 0;
let keyStillDownForSkate = 0;

export function changeDirection(e, playerId) {
    console.log(e, playerId)
    if (!keyStillDown || (players[playerId].powerUp === "skate" && keyStillDownForSkate < 4)) {
        const directions = {
            'ArrowUp': 'up',
            'ArrowRight': 'right',
            'ArrowDown': 'down',
            'ArrowLeft': 'left'
        };

        if (directions[e]) {
            moveBomberman(directions[e], playerId);
        } else if (e === 'x') {
            checkBombDrop(playerId);
        }
    }
}

function moveBomberman(direction, id) {
    const bomberman = document.querySelector(`.bomberman${players[id].color}GoingUp, .bomberman${players[id].color}GoingRight, .bomberman${players[id].color}GoingDown, .bomberman${players[id].color}GoingLeft`);
    if (!bomberman) return;

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
        SendPlayerMoveToWebSocket(id, String(bombermanIndex), String(newIndex), direction); 
        keyStillDown = true;
        if (players[id].powerUp === 'skate') {
            keyStillDownForSkate++
    } else {
        keyStillDownForSkate = 0
    }
}
}

export function setKeyUp() {
    keyStillDownForSkate = 0
    keyStillDown = false;
}

function checkBombDrop(id) {
    if ((bombDropped >= 1 && players[id].powerUp !=="extraBomb") || (bombDropped >= 2 && players[id].powerUp === "extraBomb")) return;
    const bomberman = document.querySelector(`.bomberman${players[id].color}GoingUp, .bomberman${players[id].color}GoingRight, .bomberman${players[id].color}GoingDown, .bomberman${players[id].color}GoingLeft`);
    if (!bomberman) return;

    const bombermanIndex = availableSquares.indexOf(bomberman);
    bombDropped++
    if (players[id].powerUp === 'powerBomb') {
        SendBombDropToWebSocket(id, String(bombermanIndex), true);
    } else {
    SendBombDropToWebSocket(id, String(bombermanIndex), false);
}
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


function SendBombDropToWebSocket(id, position, powerBomb) {
    actionToSend = {
        event: 'bombDrop',
        payload: {
        position: position,
        powerBomb: powerBomb
        }
    }
    players[id].connection.send(JSON.stringify(actionToSend));
}


function SendPlayerMoveToWebSocket(id, formerPosition, newPosition, direction) {
    actionToSend = {
        event: 'playerMove',
        payload: {
        playerId: id,
        formerposition: formerPosition,
        newposition: newPosition,
        direction: direction
        }
    }
    players[id].connection.send(JSON.stringify(actionToSend));
}