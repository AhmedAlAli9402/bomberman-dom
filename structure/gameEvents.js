// structure/gameEvents.js

import { availableSquares } from './buildGame.js';
import { width, game } from './model.js';
import { updateHUD } from './buildGame.js';
import { sendplayerGameOver, sendKillPlayer } from '../app.js';

const players = game.players;

export function breakWall(index, powerUp) {
    const bomb = document.getElementById(index);
    const isPowerBomb = powerUp === 'powerBomb';
    if (!bomb) return [];

    const bombPosition = Number(bomb.id);
    const directions = [-1, 1, width, -width];
    
    if (isPowerBomb) {
        const powerBombDirections = [-2, 2, width * 2, -width * 2];
        for (let i = 0; i < 4; i++) {
            if (!availableSquares[bombPosition + directions[i]].classList.contains('wall')) {
                directions.push(powerBombDirections[i]);
            }
        }
    }

    directions.forEach(dir => {
        const square = availableSquares[bombPosition + dir];
        if (square) {
            if (square.classList.contains('breakableWall')) {
                square.classList.replace('breakableWall', 'breakWall');
                setTimeout(() => square.classList.remove('breakWall'), 500);
            } else if (!square.classList.length) {
                square.classList.add("sideExplosion");
                setTimeout(() => square.classList.remove("sideExplosion"), 200);
            }
        }
    });

    bomb.classList.replace(isPowerBomb ? "powerBombDropped" : "bomb", 'explosion');
    setTimeout(() => bomb.classList.remove('explosion'), 200);

    return directions;
}

export function checkIfPlayerInBlastRadius(userId, bombPosition, directions) {
    const playerSelector = `.bomberman${players[userId].color}Going`;
    const bomberman = document.querySelector(`${playerSelector}Up, ${playerSelector}Right, ${playerSelector}Down, ${playerSelector}Left`);
    const bombermanIndex = availableSquares.indexOf(bomberman);

    if (bombermanIndex === bombPosition || directions.some(dir => bombPosition + dir === bombermanIndex)) {
        sendKillPlayer(userId);
    }
}

export function killPlayer(userId) {
    const playerSelector = `.bomberman${players[userId].color}Going`;
    const bomberman = document.querySelector(`${playerSelector}Up, ${playerSelector}Right, ${playerSelector}Down, ${playerSelector}Left`);
    bomberman.classList.add('dead');

    let recoveryPosition = players[userId].startPosition;
    if (availableSquares[recoveryPosition].classList.length > 0) {
        recoveryPosition = players.find(p => !availableSquares[p.startPosition].classList.length)?.startPosition || recoveryPosition;
    }

    setTimeout(() => {
        bomberman.removeAttribute('class');
        if (players[userId].lives !== 0) {
            availableSquares[recoveryPosition].classList.add(`bomberman${players[userId].color}GoingDown`);
        } else {
            sendplayerGameOver(players[userId].nickname);
        }
    }, 0);

    updateHUD(userId);
}
