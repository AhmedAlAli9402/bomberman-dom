import { availableSquares } from './buildGame.js'; // Importing available squares for the game grid
import { breakWall, findExplosionDirections } from './gameEvents.js'; // Importing event functions for game actions
import { width, game, powerUps } from './model.js'; // Importing game model, grid width, and power-ups
import { MyFramework } from '../vFw/framework.js'; // Importing custom framework for UI manipulations

let powerUpTimeOut; // Timeout variable for power-up expiration

// Function to convert x, y coordinates to a single position index in the grid
const positionToIndex = (position, gameGrid) =>
  position.y * gameGrid.width + position.x;

// Mapping arrow key directions to grid movement offsets and CSS transforms
const directionMap = {
  ArrowUp: { offset: -width, transform: "translateY(-100%)" },
  ArrowRight: { offset: 1, transform: "translateX(100%)" },
  ArrowDown: { offset: width, transform: "translateY(100%)" },
  ArrowLeft: { offset: -1, transform: "translateX(-100%)" },
};

// Function to move the Bomberman character based on the player's input direction
export function moveBomberman(direction, id) {
  const player = game.players[id]; // Retrieve the player by id
  const bomberman = document.querySelectorAll(
    `.bomberman${player.color}GoingUp, .bomberman${player.color}GoingRight, .bomberman${player.color}GoingDown, .bomberman${player.color}GoingLeft`
  ); // Select the current Bomberman elements

  if (!bomberman) return; // Exit if no bomberman elements found

  // Calculate the next position in the grid
  const bombermanNextIndex = positionToIndex(player.playerPosition, game.gameGrid);
  const nextSquare = document.querySelectorAll(".grid div")[bombermanNextIndex];
  
  const classDirection = direction.split('Arrow').slice(1).join(''); // Extract the direction name
  const newIndex = nextSquare.classList[0];

  // Check if the next square is available or contains a power-up
  if (nextSquare && (!nextSquare.classList.length || powerUps.includes(newIndex))) {
    if (powerUps.includes(newIndex)) {
      game.gameGrid.powerUp = game.gameGrid.powerUp.filter(powerUp => powerUp.index !== newIndex);
      addPowerUpToPlayer(newIndex, id); // Apply power-up to the player
    }

    // Move the Bomberman character visually by applying CSS transformations
    const transform = directionMap[direction].transform;
    for (let i = 0; i < bomberman.length; i++) {
      bomberman[i].style.transform = transform;
      bomberman[i].style.transition = 'transform 0.2s'; // Duration for visible movement
      const bombermanClass = bomberman[i].classList[0].replace(" bomb", "");
      bomberman[i].classList.remove(bombermanClass); // Remove previous movement class
      bomberman[i].style.transform = ""; // Reset transform after movement
      bomberman[i].style.transition = ""; // Reset transition after movement
    }
    nextSquare.className = `bomberman${player.color}Going${classDirection}`; // Apply new movement class to next square
    player.keyStillDown = true; // Mark the player's key as still pressed

    // If the player has a skate power-up, increment the key down counter
    player.keyStillDownForSkate =
      player.powerUp === "skate" ? player.keyStillDownForSkate + 1 : 0;
  }
}

// Function to handle key release, resetting key state
export function setKeyUp(id) {
  const players = game.players;

  const player = players[id];
  player.keyStillDownForSkate = 0; // Reset skate power-up key counter
  player.keyStillDown = false; // Mark key as released
}

// Function to drop a bomb on the player's current position
export function dropBomb(player) {
  console.warn("player drop bomb", player); // Log bomb drop event

  // Select the current Bomberman element
  const bomberman = document.querySelector(
    `.bomberman${player.color}GoingUp, .bomberman${player.color}GoingRight, .bomberman${player.color}GoingDown, .bomberman${player.color}GoingLeft`
  );
  if (!bomberman) return;

  // Get the player's current position in the grid and drop a bomb
  const bombermanIndex = positionToIndex(player.playerPosition, game.gameGrid);
  const bombClass = player.powerUp === "powerBomb" ? "powerBombDropped" : "bomb";
  availableSquares[bombermanIndex].classList.add(bombClass); // Add bomb class to the grid square

  // Determine the explosion directions for the bomb
  const explosionDirections = findExplosionDirections(bombermanIndex);
  
  // Trigger the explosion after 3 seconds
  setTimeout(() => {
    breakWall(bombermanIndex, explosionDirections);
  }, 3000);
}

// Function to add a power-up to a player, with a 20-second timeout for expiration
function addPowerUpToPlayer(powerUp, id) {
  const players = game.players;

  if (powerUp) {
    players[id].powerUp = powerUp; // Assign power-up to the player
    clearTimeout(powerUpTimeOut); // Clear any existing power-up timeout
    powerUpTimeOut = setTimeout(() => {
      players[id].powerUp = ""; // Remove power-up after 20 seconds
    }, 20000);
  }
}

// Function to display "Game Over" message
export function playerGameOver() {
  const gameGrid = document.getElementById("gameGrid"); // Select the game grid
  const gameOver = MyFramework.DOM("h1", { class: "game-over" }, "Game Over!"); // Create game-over message element
  gameGrid.appendChild(gameOver); // Append message to the game grid
}

// Function to reset Bomberman's position on the grid
export function resetBombermanPosition(playerid, newPosition){
  const player = game.players[playerid]; // Retrieve player by id
  const nextSquare = document.getElementById(String(newPosition)); // Find the new position on the grid
  nextSquare.className = `bomberman${player.color}GoingDown`; // Set Bomberman in the new position facing down
}
