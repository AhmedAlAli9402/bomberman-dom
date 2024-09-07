// structure/buildGame.js

import { MyFramework } from '../vFw/framework.js';
import { changeDirection, setKeyUp } from './bombermanMoves.js';
import { height, width, players, powerUps, numberOfBreakableWalls, numberOfPowerUps } from './model.js';
import { formatTime } from './helpers.js';
import { container  } from '../app.js';
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
        if (player.nickname !== ''){
        const playerSquare = availableSquares[player.startPosition];
        playerSquare.classList.add('bomberman' + player.color + 'GoingDown');}
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

   initializePlayer();
}

function initializePlayer(connection) {
    let playerId = 0
    // for (let i = 0; i < players.length; i++) {
    //     if (players[i].connection === connection) {
    //         playerId = i;
    //         break;
    //     }
    // }
    document.addEventListener('keydown', ((ev) =>changeDirection(ev.key, playerId)));
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
    // Filter players that have a nickname, then map to create lives display
    const livesDisplay = players.filter(player => player.nickname).map((player) => {
        return MyFramework.DOM(
          "div",
          {}, 
          `${player.nickname} ❤️: ${player.lives > 0 ? player.lives : '💔'}`
        );
      });
      
    const hud = MyFramework.DOM(
      "div",
      { id: "hud", style: "display: flex; justify-content: space-between;" },
      MyFramework.DOM("div", {}, `Time: ${formatTime(countdown())}`),
      // Display player lives
      ...livesDisplay
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
        return index === playerId ? lives - 1 : lives;
    }));
    const livesDisplay = document.querySelectorAll('#hud > div:not(:first-child)');
    const lives = playerLives();
    players.forEach((player, index) => {
        if (player.nickname !== ''){
            player.lives = lives[index];
            
            if (player.lives === 0) {
                livesDisplay[index].textContent = `${player.nickname} 💔`;
            }else{
                livesDisplay[index].textContent = `${player.nickname} ❤️: ${lives[index]}`;
            }
        }
    }
    );
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
        // if only one player has lives remaining, end the game // should === 1 once we have more than 2 players
        if (players.filter(player => player.lives > 0).length === 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

// End the game when the countdown reaches 0
function endGame() {
    console.log('Game over!');
    const gameGrid = document.getElementById('gameGrid');
    gameGrid.innerHTML = '';  // Clear the game grid
    
    // Display "Game Over" message
    const gameOver = MyFramework.DOM('h1', { class: 'game-over' }, 'Game Over!');
    gameGrid.appendChild(gameOver);
    
    // Determine the winner with the most lives remaining (if any) otherwise, no winner if all players have 0 lives or equal lives
    const winnerIndex = players.reduce((winnerIndex, player, index) => {
        return player.lives > players[winnerIndex].lives ? index : winnerIndex;
    }, 0);

    console.log('winnerIndex', winnerIndex);
    console.log("players", players);
    if (winnerIndex !== -1 && players.filter(player => player.lives > 0).length === 1) {
        const winnerName = players[winnerIndex].nickname; // Get the winner's name
        // Display the winner
        const winnerDisplay = MyFramework.DOM('h2', { class: 'winner-display' }, `${winnerName} is the winner!`);
        gameGrid.appendChild(winnerDisplay);
    } else {
        const noWinner = MyFramework.DOM('h2', { class: 'winner-display' }, 'No winner!');
        gameGrid.appendChild(noWinner);
    }
}