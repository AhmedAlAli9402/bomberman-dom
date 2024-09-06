// structure/buildGame.js

import { MyFramework } from '../vFw/framework.js';
import { changeDirection, setKeyUp } from './bombermanMoves.js';
import { height, width, players, powerUps, numberOfBreakableWalls, numberOfPowerUps } from './model.js';
import { formatTime } from './helpers.js';
import { container } from '../app.js';
import {countdown, setCountdown} from './model.js';
export let availableSquares = [];

// Initial lives for each player, starting with 3 lives each
export let initialLives = [3, 3, 3, 3]; // 4 players
// Initialize player lives as reactive state
export const [playerLives, setPlayerLives] = MyFramework.State([...initialLives]);

export function buildGame() {
    console.log('Building game...');
    const grid = document.getElementById('grid');
    // console.log(grid);
    // Create the grid squares and append to grid
    for (let i = 0; i < width * height; i++) {
        const square = MyFramework.DOM(  'div',  { id: i.toString() } );
        grid.appendChild(square);
    }

    // Create walls along the grid edges
    const createWall = (index) => document.getElementById(index).classList.add('wall');
    for (let i = 0; i < width; i++) {
        createWall(i);
        createWall(i + (height - 1) * width);
    }
    for (let i = width; i < width * height; i += width) {
        createWall(i);
        createWall(i + width - 1);
    }

    // Create internal walls
    for (let i = (width * 2) + 2, j = 0; i < width * height; i += 2, j++) {
        createWall(i);
        if (j === (width - 3) / 2) {
            i += (width + 3)-2;
            j = -1;
        }
    }

    availableSquares = Array.from(document.querySelectorAll('.grid div'));

    // Set player starting positions
    players.forEach((player) => {
        const playerSquare = availableSquares[player.startPosition];
        playerSquare.classList.add('bomberman' + player.color + 'GoingDown');
    });
    let emptySquares = availableSquares.filter(
        (square) => !square.getAttribute('class')
    );

    // Place breakable walls
    for (let i = 0; i < numberOfBreakableWalls; i++) {
        const random = getRandomIndex(emptySquares.length);
        const targetSquare = emptySquares[random];
        if (!targetSquare.classList.contains('breakableWall')) {
            targetSquare.classList.add('breakableWall');
        } else {
            i--;
        }
    }

    // Ensure no blocked initial paths
    removeBlockedPaths(availableSquares);

    // Place power-ups
    for (const powerUp of powerUps) {
        for (let j = 0; j < numberOfPowerUps / powerUps.length; j++) {
            const random = getRandomIndex(emptySquares.length);
            const targetSquare = emptySquares[random];
            if (targetSquare.classList.contains('breakableWall') && targetSquare.classList.length < 2) {
                targetSquare.classList.add(powerUp);
            } else {
                j--;
            }
        }
    }

    startTimer(countdown());

    // Add event listeners
    document.addEventListener('keydown', changeDirection);
    document.addEventListener('keyup', setKeyUp);
}

function getRandomIndex(length) {
    return Math.floor(Math.random() * (length - 1)) + 1;
}

function removeBlockedPaths(availableSquares) {
    const pathsToCheck = [
        { idx1: width + 2, idx2: (width * 2) + 1 }, // top left corner
        { idx1: width + 2, idx2: (width * 3) + 1 },
        { idx1: width + 3, idx2: (width * 2) + 1 },
        { idx1: (width*height)-(width*2)+2, idx2: (width*height)-(width*3)+1 }, // bottom left corner
        { idx1: (width*height)-(width*2)+2, idx2: (width*height)-(width*4)+1 },
        { idx1: (width*height)-(width*4)+1, idx2: (width*height)-(width*3)+1 },
        { idx1: (width*2)-3, idx2: (width*3)-2}, // top right corner
        { idx1: (width*2)-4, idx2: (width*3)-2},
        { idx1: (width*2)-3, idx2: (width*4)-2},
        { idx1: (width*height)-width-3, idx2: (width*height)-(width*2)-2 }, // bottom right corner
        { idx1: (width*height)-width-4, idx2: (width*height)-(width*2)-2 },
        { idx1: (width*height)-width-3, idx2: (width*height)-(width*3)-2 }
    ];

    pathsToCheck.forEach(({ idx1, idx2 }) => {
        // console.log(idx1, idx2)
        if (availableSquares[idx1].classList.contains('breakableWall') && availableSquares[idx2].classList.contains('breakableWall')) {
            availableSquares[idx2].classList.remove('breakableWall');
        }
    });
}

// Show the game grid and HUD
export function showGameGrid() {
    const gameGrid = MyFramework.DOM(
      "div",
      { id: "gameGrid", style: "display: inherit;" },
      MyFramework.DOM("h1", null, "Bomberman Game"),
      createHUD(),  // Adding the HUD to the game grid
      MyFramework.DOM("div", { id: "grid", class: "grid" })
    );
  
    container.innerHTML = "";
    container.appendChild(gameGrid);
}
  
// Create the HUD with player lives and time countdown
function createHUD() {
    setCountdown(180); // 3 minutes
    const hud = MyFramework.DOM(
      "div",
      { id: "hud", style: "display: flex; justify-content: space-between;" },
      MyFramework.DOM("div", {}, `Time: ${formatTime(countdown())}`),
      
      MyFramework.DOM("div", {}, `Player 1 Lives: ${playerLives()[0]}`),
      MyFramework.DOM("div", {}, `Player 2 Lives: ${playerLives()[1]}`),
      MyFramework.DOM("div", {}, `Player 3 Lives: ${playerLives()[2]}`),
      MyFramework.DOM("div", {}, `Player 4 Lives: ${playerLives()[3]}`)
    );
  
    return hud;
}
  
// Function to update the HUD when player lives change
export function updateHUD(playerId) {
    const timeDisplay = document.querySelector('#hud > div');
    if (timeDisplay) {
      timeDisplay.textContent = `Time: ${formatTime(countdown())}`;
}
// update player lives by player id
setPlayerLives(playerLives().map((lives, index) => {
      return index === playerId-1 ? lives - 1 : lives;
}));
const livesDisplay = document.querySelectorAll('#hud > div:not(:first-child)');
const lives = playerLives();

livesDisplay.forEach((display, index) => {
      display.textContent = `Player ${index + 1} Lives: ${lives[index]}`;
});
}


// Start the countdown timer
function startTimer(time) {
    setCountdown(time); // 3 minutes
    const timer = setInterval(() => {
        setCountdown(countdown() - 1);
        if (countdown() === 0) {
            clearInterval(timer);
            endGame();
        }
        updateHUD();
    }, 1000);
}

// End the game when the countdown reaches 0
function endGame() {
    console.log('Game over!');
    const gameGrid = document.getElementById('gameGrid');
    gameGrid.innerHTML = '';
    const gameOver = MyFramework.DOM('h1', {}, 'Game Over!');
    gameGrid.appendChild(gameOver);
    const winner = playerLives().filter((lives) => lives > 0);
    const winnerDisplay = MyFramework.DOM('h2', {}, `Player ${winner[0]} wins!`);
    gameGrid.appendChild(winnerDisplay);
}