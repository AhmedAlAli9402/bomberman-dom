// structure/gameEvents.js

import { availableSquares } from './buildGame.js';
import { width, game } from './model.js';
import { updateHUD } from './buildGame.js';
import { sendplayerGameOver, sendKillPlayer } from '../app.js';

let players = game.players;

export function findExplosionDirections(id){
    let bomb = document.getElementById(id);
    let powerbomb = false
    if (!bomb.classList.contains('bomb')) {
        bomb = document.querySelector('.powerBombDropped');
        powerbomb = true;
    }
    if (!bomb) return;
    const bombPosition = Number(bomb.getAttribute('id'));
    let directions = [-1, 1, width, -width];
    if (powerbomb) {
        let powerbombDirections = [-2, 2, width*2, -width*2];
        for (let i = 0; i < 4; i++) {
            if (!availableSquares[bombPosition + directions[i]].classList.contains('wall')) {
                directions.push(powerbombDirections[i]);                
            }
        }
        } 
        return directions
        ;
    }

export function breakWall(id, directions) {
    let bomb = document.getElementById(id);
    const bombPosition = Number(bomb.getAttribute('id'));
        for (let i = 0; i < directions.length; i++) {
       const square = availableSquares[bombPosition + directions[i]];
        if (square && square.classList.contains('breakableWall')) {
            square.classList.replace('breakableWall', 'breakWall');
            setTimeout(() => square.classList.remove('breakWall'), 500);
        } else if (square && !square.classList.length) {
            square.classList.add("sideExplosion");
            setTimeout(() => square.classList.remove("sideExplosion"), 200);
        }
    };
    bomb.classList.replace("bomb", 'explosion');
    if (bomb.classList.contains('powerBombDropped')) {
        bomb.classList.replace('powerBombDropped', 'explosion');
    }
    setTimeout(() => bomb.classList.remove('explosion'), 200);
    console.log(directions)
}


export function checkIfPlayerInBlastRadius(userId, bombPosition, directions) {
    const bomberman = document.querySelector(`.bomberman${players[userId].color}GoingUp, .bomberman${players[userId].color}GoingRight, .bomberman${players[userId].color}GoingDown, .bomberman${players[userId].color}GoingLeft`);
    const bombermanIndex = availableSquares.indexOf(bomberman);
    for (let i=0;i<directions.length;i++) {
        let explosionPosition = bombPosition + directions[i];
        console.log(explosionPosition, bombermanIndex)
    if (explosionPosition === bombermanIndex) {
        sendKillPlayer(userId);
        return
    }}
    if (bombermanIndex === bombPosition) {
        sendKillPlayer(userId);
    }

}

export function killPlayer(userId) {
    const bomberman = document.querySelector(`.bomberman${players[userId].color}GoingUp, .bomberman${players[userId].color}GoingRight, .bomberman${players[userId].color}GoingDown, .bomberman${players[userId].color}GoingLeft`);
    bomberman.classList.add('dead');
    let recoveryPosition =players[userId].startPosition
    console.log(availableSquares[recoveryPosition].classList.length)
    if (availableSquares[recoveryPosition].classList.length > 0) {
        for (let i=0;i<players.length;i++){
            if (availableSquares[players[i].startPosition].classList.length === 0){ {
                recoveryPosition = players[i].startPosition;
            }
        }
    }}
    setTimeout(() => {bomberman.removeAttribute('class');
        if (players[userId].lives !== 0) {
        availableSquares[recoveryPosition].classList.add(`bomberman${players[userId].color}GoingDown`)
        } else {
            sendplayerGameOver(players[userId].nickname); 
        }
       ;})

    updateHUD(userId)
}
