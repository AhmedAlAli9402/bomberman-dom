// structure/gameEvents.js

import { availableSquares } from './buildGame.js';
import { width, players } from './model.js';
import { updateHUD } from './buildGame.js';

export function breakWall(id) {
    let bomb = document.getElementById(id);
    let powerbomb = false
    if (!bomb.classList.contains('bomb')) {
        bomb = document.querySelector('.powerBombDropped');
        powerbomb = true;
    }
    if (!bomb) return;
    const bombIndex = availableSquares.indexOf(bomb);
    const bombPosition = Number(bomb.getAttribute('id'));

    explosion(bombPosition, powerbomb);

    const directions = [-1, 1, width, -width];

    if (powerbomb) {
        directions.push(-2, 2, -width*2, width*2);
    } 

    directions.forEach((direction) => {
        const square = availableSquares[bombPosition + direction];
        if (square && square.classList.contains('breakableWall')) {
            square.classList.replace('breakableWall', 'breakWall');
            setTimeout(() => square.classList.remove('breakWall'), 500);
        }
    });

    bomb.classList.replace("bomb", 'explosion');
    if (powerbomb) {
        bomb.classList.replace('powerBombDropped', 'explosion');
    }
    setTimeout(() => bomb.classList.remove('explosion'), 200);
}

function explosion(bombPosition, powerbomb) {
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

    directions.forEach((explosionPosition) => {
        checkIfPlayerInBlastRadius(bombPosition+explosionPosition);
        const targetSquare = availableSquares[bombPosition + explosionPosition];
        if (targetSquare && !targetSquare.classList.length) {
            targetSquare.classList.add("sideExplosion");
            setTimeout(() => targetSquare.classList.remove("sideExplosion"), 200);
        }
    });
}

function checkIfPlayerInBlastRadius(explosionPosition) {
    for (let i = 0; i < players.length; i++) {
    const bomberman = document.querySelector(`.bomberman${players[i].color}GoingUp, .bomberman${players[i].color}GoingRight, .bomberman${players[i].color}GoingDown, .bomberman${players[i].color}GoingLeft`);
    const bombermanIndex = availableSquares.indexOf(bomberman);
        console.log(explosionPosition, bombermanIndex)
    if (explosionPosition === bombermanIndex) {
        killPlayer(bomberman, i);
    }
}
}

function killPlayer(bomberman, playerId) {
    bomberman.classList.add('dead');
    let recoveryPosition =players[playerId].startPosition
    console.log(availableSquares[recoveryPosition])
    if (availableSquares[recoveryPosition].childNodes.length > 0) {
        console.log('nope')
        for (let i=0;i<players.length;i++){
            if (availableSquares[players[i].startPosition].length === 0){ {
                recoveryPosition = players[i].startPosition;
            }
        }
    }}
    setTimeout(() => {bomberman.removeAttribute('class');
    availableSquares[recoveryPosition].classList.add(`bomberman${players[playerId].color}GoingDown`);}, 500)
    updateHUD(playerId)
}
