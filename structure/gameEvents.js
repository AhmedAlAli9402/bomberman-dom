// structure/gameEvents.js

import { availableSquares } from './buildGame.js';
import { width, game } from './model.js';
import { updateHUD } from './buildGame.js';
import { sendplayerGameOver, sendKillPlayer } from '../app.js';

let players = game.players;

export function checkIfPlayerInBlastRadius(userId, bombPosition) {
    let bomb = document.getElementById(bombPosition);
    let powerbomb = false
    if (!bomb.classList.contains('bomb')) {
        bomb = document.querySelector('.powerBombDropped');
        powerbomb = true;
        bomb.classList.replace('powerBombDropped', 'explosion');
    } else {
        bomb.classList.replace("bomb", 'explosion');
    }
    setTimeout(() => bomb.classList.remove('explosion'), 200);
    const directions = [
        -width, width, -1, 1
    ];
    if (powerbomb) {
        let powerbombDirections = [-width*2, width*2, -2, 2];
        for (let i = 0; i < 4; i++) {
            if (!availableSquares[bombPosition + directions[i]].classList.contains('wall')) {
                directions.push(powerbombDirections[i]);                
            }
        }
    }
    const bomberman = document.querySelector(`.bomberman${players[userId].color}GoingUp, .bomberman${players[userId].color}GoingRight, .bomberman${players[userId].color}GoingDown, .bomberman${players[userId].color}GoingLeft`);
    const bombermanIndex = availableSquares.indexOf(bomberman);
    directions.forEach((explosionPosition) => {
        const targetSquare = availableSquares[bombPosition + explosionPosition];
        if (targetSquare && !targetSquare.classList.length) {
            targetSquare.classList.add("sideExplosion");
            setTimeout(() => targetSquare.classList.remove("sideExplosion"), 200);
        } else if (square && square.classList.contains('breakableWall')) {
            square.classList.replace('breakableWall', 'breakWall');
            setTimeout(() => square.classList.remove('breakWall'), 500);
        }
    if (explosionPosition === bombermanIndex) {
        sendKillPlayer(userId);
    }});

    if (bombPosition === bombermanIndex) {
        sendKillPlayer(userId);
    }
}

export function killPlayer(bomberman, playerId) {
    bomberman.classList.add('dead');
    let recoveryPosition =players[playerId].startPosition
    if (availableSquares[recoveryPosition].childNodes.length > 0) {
        for (let i=0;i<players.length;i++){
            if (availableSquares[players[i].startPosition].length === 0){ {
                recoveryPosition = players[i].startPosition;
            }
        }
    }}
    setTimeout(() => {bomberman.removeAttribute('class');
        if (players[playerId].lives !== 0) {
    availableSquares[recoveryPosition].classList.add(`bomberman${players[playerId].color}GoingDown`)
} else {
    sendplayerGameOver(players[playerId].nickname); 
}
    ;}, 10)
    updateHUD(playerId)
}
