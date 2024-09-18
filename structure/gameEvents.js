// structure/gameEvents.js

import { availableSquares } from './buildGame.js';
import { width, game } from './model.js';
import { updateHUD } from './buildGame.js';
import { sendplayerGameOver, sendKillPlayer } from '../app.js';

let players = game.players;

export function breakWall(id, directions) {
    let bomb = document.getElementById(id);
    const bombPosition = Number(bomb.getAttribute('id'));
        for (let i = 0; i < directions.length; i++) {
       const square = availableSquares[bombPosition + directions[i]];
        if (square && square.classList.contains('breakableWall')) {
            square.classList.replace('breakableWall', 'breakWall');
            game.gameGrid.breakableWall = game.gameGrid.breakableWall.filter(wall => wall !== bombPosition + directions[i]);
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
    if (availableSquares[recoveryPosition].childNodes.length > 0) {
        for (let i=0;i<players.length;i++){
            if (availableSquares[players[i].startPosition].length === 0){ {
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
    ;}, 10)
    updateHUD(userId)
}

export function checkGameStructure(gameGrid){
    console.log(gameGrid)
    console.log(game.gameGrid)
    if (gameGrid.breakableWall.length < game.gameGrid.breakableWall.length) {
        game.gameGrid.breakableWall.map(wall => {if (!gameGrid.breakableWall.includes(wall)) {
            document.getElementById(wall).classList.remove('breakableWall');}
        });
        game.gameGrid.breakableWall = gameGrid.breakableWall;
    }
    if (gameGrid.powerUps.length < game.gameGrid.powerUps.length) {
        game.gameGrid.powerUps.map(powerUps => {if (!gameGrid.powerUps.includes(powerUps)) {
            document.getElementById(powerUps.index).classList.remove(powerUps.powerUp);}});
        game.gameGrid.powerUps = gameGrid.powerUps;
    }
}