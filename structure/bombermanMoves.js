import { availableSquares } from './buildGame.js';
import { breakWall, findExplosionDirections } from './gameEvents.js';
import { width, game, powerUps } from './model.js';
import { MyFramework } from '../vFw/framework.js';
// import { sendBombExplosion } from '../app.js';
// import { breakWall, findExplosionDirections } from './gameEvents.js';

let powerUpTimeOut;

// Function to convert x, y to a single position index
const positionToIndex = (position, gameGrid) =>
  position.y * gameGrid.width + position.x;

const directionMap = {
  ArrowUp: { offset: -width, transform: "translateY(-100%)" },
  ArrowRight: { offset: 1, transform: "translateX(100%)" },
  ArrowDown: { offset: width, transform: "translateY(100%)" },
  ArrowLeft: { offset: -1, transform: "translateX(-100%)" },
};

export function moveBomberman(direction, id) {
  const player = game.players[id];
  const bomberman = document.querySelectorAll(
    `.bomberman${player.color}GoingUp, .bomberman${player.color}GoingRight, .bomberman${player.color}GoingDown, .bomberman${player.color}GoingLeft`
  );
  if (!bomberman) return;

  const bombermanNextIndex = positionToIndex(
    player.playerPosition,
    game.gameGrid
  );
  
  const nextSquare = document.querySelectorAll(".grid div")[bombermanNextIndex];
  const classDirection = direction.split('Arrow').slice(1).join('');
  const newIndex = nextSquare.classList[0]
  if (nextSquare && (!nextSquare.classList.length || powerUps.includes(newIndex))) {
    if (powerUps.includes(newIndex)) {
      game.gameGrid.powerUp = game.gameGrid.powerUp.filter(powerUp => powerUp.index !== newIndex);
      addPowerUpToPlayer(newIndex, id);
    }
    // Move the bomberman visually
    const transform = directionMap[direction].transform;
    for (let i = 0; i < bomberman.length; i++) {
      bomberman[i].style.transform = transform;
      bomberman[i].style.transition = 'transform 0.2s'; // Increased duration for visibility
      const bombermanClass = bomberman[i].classList[0].replace(" bomb", "");
      bomberman[i].classList.remove(bombermanClass);
      bomberman[i].style.transform = "";
      bomberman[i].style.transition = "";
    }
      nextSquare.className = `bomberman${player.color}Going${classDirection}`;
    player.keyStillDown = true;
    player.keyStillDownForSkate =
      player.powerUp === "skate" ? player.keyStillDownForSkate + 1 : 0;
  }
}

export function setKeyUp(id) {
  const players = game.players;

  const player = players[id];
  player.keyStillDownForSkate = 0;
  player.keyStillDown = false;
}

export function dropBomb(player) {

  console.warn("player drop bomb", player);
  const bomberman = document.querySelector(
    `.bomberman${player.color}GoingUp, .bomberman${player.color}GoingRight, .bomberman${player.color}GoingDown, .bomberman${player.color}GoingLeft`
  );
  if (!bomberman) return;

  const bombermanIndex = positionToIndex(player.playerPosition, game.gameGrid);
  const bombClass = player.powerUp === "powerBomb" ? "powerBombDropped" : "bomb";
  availableSquares[bombermanIndex].classList.add(bombClass);
  const explosionDirections = findExplosionDirections(bombermanIndex);
  setTimeout(() => {
    breakWall(bombermanIndex, explosionDirections);
  }, 3000);
}

function addPowerUpToPlayer(powerUp, id) {
  const players = game.players;

  if (powerUp) {
    players[id].powerUp = powerUp;
    clearTimeout(powerUpTimeOut);
    powerUpTimeOut = setTimeout(() => {
      players[id].powerUp = "";
    }, 20000);
  }
}

export function playerGameOver() {
  const gameGrid = document.getElementById("gameGrid");
  const gameOver = MyFramework.DOM("h1", { class: "game-over" }, "Game Over!");
  gameGrid.appendChild(gameOver);
}

export function resetBombermanPosition(playerid, newPosition){
  const player = game.players[playerid];
  const nextSquare = document.getElementById(String(newPosition));
    nextSquare.className = `bomberman${player.color}GoingDown`;
  ;
}
