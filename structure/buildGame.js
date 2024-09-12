// structure/buildGame.js

import { MyFramework } from '../vFw/framework.js';
import { game } from './model.js';
import { formatTime } from './helpers.js';
import { container  } from '../app.js';
import {countdown, setCountdown} from './model.js';
import { sendPlayerMove , sendkeyUp } from '../app.js';

export let availableSquares = [];
let players = game.players;
// Initial lives for each player, starting with 3 lives each
export const initialLives = [3, 3, 3, 3]; // 4 players
// Initialize player lives as reactive state
export const [playerLives, setPlayerLives] = MyFramework.State([...initialLives]);

// build game depending on the array sent from the server
export function buildGame(gameGrid){
    const grid = document.getElementById('grid');
    const fragment = document.createDocumentFragment();
    // create the divs required and number them in ascending order
    for (let i = 0; i < gameGrid.allsquares.length; i++) {
        const square = MyFramework.DOM('div', { id: i });
        fragment.appendChild(square);
    }
    grid.appendChild(fragment);
    
    // create the wall squares
    gameGrid.wall.forEach(wall => document.getElementById(wall.toString()).classList.add('wall'));

    // create the breakable walls
    gameGrid.breakableWall.forEach(breakableWall => document.getElementById(breakableWall).classList.add('breakableWall'));

    // add powerups based on the randomized index sent from server
    gameGrid.powerUp.forEach(({ index, powerUp }) => document.getElementById(index).classList.add(powerUp));

    availableSquares = Array.from(document.querySelectorAll('.grid div'));

    // Set player starting positions
    players.forEach((player, i) => {
        if (player.nickname !== '') {
            availableSquares[player.startPosition].classList.add(`bomberman${player.color}GoingDown`);
        }
    });

    // Ensure no blocked initial paths
    startTimer(countdown());

    // Add event listeners for player movement
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

function handleKeyDown(event) {
    console.log('handleKeyDown', event);
    const key = event.key;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'x'].includes(key)) {
        console.log('here1');
        sendPlayerMove(event);
    }
}

function handleKeyUp(event) {
    const key = event.key;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'x'].includes(key)) {
        sendkeyUp();
    }
}

// Show the game grid and HUD
export function showGameGrid() {
    const gameGrid = MyFramework.DOM('div',
    { id: "gameGrid" },
     MyFramework.DOM("div", { id: "grid", class: "grid" })
    );

    const overlay = document.getElementById("overlay");
    overlay.innerHTML = "";
    overlay.appendChild(MyFramework.DOM("div", { id: "container" }, createHUD()));
    overlay.appendChild(MyFramework.DOM("h1", null, "Bomberman Game"));
    overlay.appendChild(MyFramework.DOM("img", {id:"logo", src: "images/logo.png", alt: "Bomberman"}, null));
    container.removeChild(document.getElementById('waitingArea'));
    container.appendChild(gameGrid);
}

// Create the HUD with player lives and time countdown
function createHUD() {
    const livesDisplay = players.filter(player => player.nickname).map((player) => 
        MyFramework.DOM("div", {}, `${player.nickname} ❤️: ${player.lives > 0 ? player.lives : '💔'}`)
    );

    return MyFramework.DOM(
      "div",
      { id: "hud", style: "display: flex; justify-content: space-between;" },
      MyFramework.DOM("div", {}, `Time: ${formatTime(countdown())}`),
      ...livesDisplay
    );
}

// Function to update the HUD when player lives change
export function updateHUD(playerId) {
    const timeDisplay = document.querySelector('#hud > div');
    if (timeDisplay) {
      timeDisplay.textContent = `Time: ${formatTime(countdown())}`;
    }
    // update player lives by player id
    setPlayerLives(playerLives().map((lives, index) => index === playerId ? lives - 1 : lives));
    const livesDisplay = document.querySelectorAll('#hud > div:not(:first-child)');
    const lives = playerLives();
    players.forEach((player, i) => {
        if (player.nickname !== '') {
            player.lives = lives[i];
            livesDisplay[i].textContent = `${player.nickname} ${player.lives > 0 ? `❤️: ${lives[i]}` : '💔'}`;
        }
    });
}

// Start the countdown timer
function startTimer(time) {
    setCountdown(time); // 3 minutes
    const timer = setInterval(() => {
        setCountdown(countdown() - 1);
        if (countdown() === 0 || players.filter(player => player.lives > 0).length === 1) {
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
    gameGrid.innerHTML = '';  // Clear the game grid

    // Display "Game Over" message
    gameGrid.appendChild(MyFramework.DOM('h1', { class: 'game-over' }, 'Game Over!'));

    // Determine the winner with the most lives remaining (if any) otherwise, no winner if all players have 0 lives or equal lives
    const maxLives = Math.max(...players.map(player => player.lives));
    const winners = players.filter(player => player.lives === maxLives);

    if (winners.length === 1 && maxLives > 0) {
        gameGrid.appendChild(MyFramework.DOM('h2', { class: 'winner-display' }, `${winners[0].nickname} is the winner!`));
    } else {
        gameGrid.appendChild(MyFramework.DOM('h2', { class: 'winner-display' }, 'No winner!'));
    }

    gameGrid.appendChild(MyFramework.DOM('button', { class: 'startNewGame', onclick: startNewGame }, 'Start New Game'));
}

function startNewGame(){
    window.location.reload();
}