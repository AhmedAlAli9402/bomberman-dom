// structure/buildGame.js

import { MyFramework } from '../vFw/framework.js';
import { game } from './model.js';
import { formatTime } from './helpers.js';
import { container  } from '../app.js';
import {countdown, setCountdown} from './model.js';
import { sendPlayerMove , sendkeyUp, sendplayerGameOver} from '../app.js';

export let availableSquares = [];
let players = game.players;
// Initial lives for each player, starting with 3 lives each
export let initialLives = [3, 3, 3, 3]; // 4 players
// Initialize player lives as reactive state
export const [playerLives, setPlayerLives] = MyFramework.State([...initialLives]);

export function buildGame(gameGrid){
    const grid = document.getElementById('grid');
    for (let i = 0; i < gameGrid.allsquares.length; i++) {
        const square = MyFramework.DOM(  'div',  { id: i } );
        grid.appendChild(square);
    }
    const createWall = (index) => document.getElementById(index.toString()).classList.add('wall');

    for (const wall of gameGrid.wall) {
        createWall(wall);
    }

    const createBreakableWall = (index) => document.getElementById(index).classList.add('breakableWall');

    for (const breakableWall of gameGrid.breakableWall) {
        createBreakableWall(breakableWall);
    }

    const createPowerUp = (index, powerUp) => {
        const square = document.getElementById(index);
        square.classList.add(powerUp);
    }

    for (const { index, powerUp } of gameGrid.powerUp) {
        createPowerUp(index, powerUp);
    }

    availableSquares = Array.from(document.querySelectorAll('.grid div'));

    // Set player starting positions
    players.forEach((player) => {
        if (player.nickname !== ''){
        const playerSquare = availableSquares[player.startPosition];
        playerSquare.classList.add('bomberman' + player.color + 'GoingDown');}
    });

    // Ensure no blocked initial paths
    startTimer(countdown());
    initializePlayer();
}

function initializePlayer() {
    // Add event listeners for player movement
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight' || key === 'x') {
            sendPlayerMove(event);
        }
    }
    );

    document.addEventListener('keyup', (event) => {
        const key = event.key;
        if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight'|| key === 'x') {
            sendkeyUp();
        }
    }
    );
}

export function deinitializePlayer() {
    document.removeEventListener('keydown', ((ev) => sendPlayerMove(ev)));
        document.removeEventListener('keyup', sendkeyUp);
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
    container.removeChild(document.getElementById('waitingArea'));
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
