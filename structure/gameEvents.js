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
}


export function killPlayer(userId) {
    const bomberman = document.querySelector(`.bomberman${players[userId].color}GoingUp, .bomberman${players[userId].color}GoingRight, .bomberman${players[userId].color}GoingDown, .bomberman${players[userId].color}GoingLeft`);
    bomberman.classList.add('dead');
    setTimeout(() => {bomberman.removeAttribute('class');
    ;}, 50)
    updateHUD(userId)
}

export function checkGameStructure(gameGrid){
    if (gameGrid.breakableWall.length < game.gameGrid.breakableWall.length) {
        game.gameGrid.breakableWall.map(wall => {if (!gameGrid.breakableWall.includes(wall)) {
            document.getElementById(wall).classList.remove('breakableWall');}
        });
        game.gameGrid.breakableWall = gameGrid.breakableWall;
    } else if (gameGrid.breakableWall.length > game.gameGrid.breakableWall.length) {
        gameGrid.breakableWall.map(wall => {if (!game.gameGrid.breakableWall.includes(wall)) {
            document.getElementById(wall).classList.add('breakableWall');}
        });
    }
    if (gameGrid.powerUps.length < game.gameGrid.powerUps.length) {
        game.gameGrid.powerUps.map(powerUps => {if (!gameGrid.powerUps.includes(powerUps)) {
            document.getElementById(powerUps.index).classList.remove(powerUps.powerUp);}});
        game.gameGrid.powerUps = gameGrid.powerUps;
    }
}
