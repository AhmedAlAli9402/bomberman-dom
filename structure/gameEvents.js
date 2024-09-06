// structure/gameEvents.js

import { availableSquares } from './buildGame.js';
import { width, players } from './model.js';

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
    checkIfPlayerInBlastRadius(bombPosition);

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

function explosion(id, powerbomb) {
    const directions = [
        -width, width, -1, 1
    ];

    if (powerbomb) {
        let powerbombDirections = [-width*2, width*2, -2, 2];
        for (let i = 0; i < 4; i++) {
            if (!availableSquares[id + directions[i]].classList.contains('wall')) {
                directions.push(powerbombDirections[i]);                
            }
        }
    }

    directions.forEach((explosionPosition) => {
        const targetSquare = availableSquares[id + explosionPosition];
        if (targetSquare && !targetSquare.classList.length) {
            targetSquare.classList.add("sideExplosion");
            setTimeout(() => targetSquare.classList.remove("sideExplosion"), 200);
        }
    });
}

function checkIfPlayerInBlastRadius(bombPosition) {
    const bomberman = document.querySelector(`.bomberman${players[3].color}GoingUp, .bomberman${players[3].color}GoingRight, .bomberman${players[3].color}GoingDown, .bomberman${players[3].color}GoingLeft`);
    const bombermanIndex = availableSquares.indexOf(bomberman);
        console.log(bombPosition, bomberman)
    if ([bombPosition, bombPosition - 1, bombPosition + 1, bombPosition + width, bombPosition - width].includes(bombermanIndex)) {
        killPlayer(bomberman);
    }
}

function killPlayer(bomberman) {
    bomberman.classList.add('dead');
    setTimeout(() => bomberman.classList.remove('dead'), 500);
}
