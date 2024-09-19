import { MyFramework } from "../vFw/framework.js";
import { game } from "./model.js";
import { formatTime } from "./helpers.js";
import { container } from "../app.js";
import { countdown, setCountdown } from "./model.js";
import { sendPlayerMove, sendkeyUp, sendplayerGameOver, sendPlaceBomb, update } from "../app.js";

export let availableSquares = [];
// Initial lives for each player, starting with 3 lives each
export let initialLives = [3, 3, 3, 3]; // 4 players
// Initialize player lives as reactive state
export const [playerLives, setPlayerLives] = MyFramework.State([
  ...initialLives,
]);

// build game depending on the array sent from the server
export function buildGame() {
  let Players = game.players;
  const gameGrid = game.gameGrid;
  const grid = document.getElementById("grid");
  // create the divs required and number them in ascending order
  for (let i = 0; i < gameGrid.allsquares.length; i++) {
    const square = MyFramework.DOM("div", { id: i });
    grid.appendChild(square);
  }

  // create the wall squares
  const createWall = (index) =>
    document.getElementById(index.toString()).classList.add("wall");

  for (const wall of gameGrid.wall) {
    createWall(wall);
  }

  // create the breakable walls
  const createBreakableWall = (index) =>
    document.getElementById(index).classList.add("breakableWall");

  for (const breakableWall of gameGrid.breakableWall) {
    createBreakableWall(breakableWall);
  }

  // add powerups based on the randomized index sent from server
  const createPowerUp = (index, powerUp) => {
    const square = document.getElementById(index);
    square.classList.add(powerUp);
  };

  for (const { index, powerUp } of gameGrid.powerUp) {
    createPowerUp(index, powerUp);
  }

  availableSquares = Array.from(document.querySelectorAll(".grid div"));

  // Set player starting positions
  for (let i = 0; i < Players.length; i++) {
    if (Players[i].nickname !== "") {
      // Get the player's starting position
      const { x, y } = Players[i].startPosition;

      // Check if x and y are valid numbers
      if (typeof x === "number" && typeof y === "number") {
        // Calculate the square index based on x and y coordinates
        const playerSquareIndex = y * gameGrid.width + x;

        // Check if the calculated index is valid
        if (
          playerSquareIndex >= 0 &&
          playerSquareIndex < availableSquares.length
        ) {
          const playerSquare = availableSquares[playerSquareIndex];

          // Add the player class to the corresponding square
          playerSquare.classList.add(
            "bomberman" + Players[i].color + "GoingDown"
          );
        } else {
          console.error(
            `Invalid player square index for player ${Players[i].nickname}:`,
            playerSquareIndex
          );
        }
      } else {
        console.error(
          `Invalid coordinates for player ${Players[i].nickname}:`,
          { x, y }
        );
      }
    }
  }

  // Ensure no blocked initial paths
  startTimer(countdown());
  (initializePlayer());
}

const keyStates = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  x: false, // Add any other keys you want to track
};

function initializePlayer() {
  // Ensure the grid element is focusable
  document.getElementById("gameGrid").setAttribute("tabindex", "0");

  // Add event listeners for player movement
  document.getElementById("gameGrid").addEventListener("keydown", function (event) {
    const key = event.key;
    if (key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight") {
        update(sendPlayerMove(event)); // Send the initial move message
    } else if (key === "x") {
      if (!keyStates[key]) {
        keyStates[key] = true; // Set the key state to pressed
        update(sendPlaceBomb(event)); // Send the place bomb message
      }
    }
  });

  document.addEventListener("keyup", (event) => {
    const key = event.key;
    if (keyStates.hasOwnProperty(key)) {
      keyStates[key] = false; // Set the key state to not pressed
      update(sendkeyUp(event)); // Handle key up event
    }
  });
}

// Show the game grid and HUD
let count = 0;
export function showGameGrid() {
  const gameGrid = MyFramework.DOM(
    "div",
    { id: "gameGrid", style: "display: inherit;" },
    MyFramework.DOM("div", { id: "grid", class: "grid" })
  );

  document.getElementById("overlay").innerHTML = "";
  document
    .getElementById("overlay")
    .appendChild(MyFramework.DOM("div", { id: "container" }, createHUD));
  document
    .getElementById("overlay")
    .appendChild(MyFramework.DOM("h1", null, "Bomberman Game"));
  document
    .getElementById("overlay")
    .appendChild(
      MyFramework.DOM(
        "img",
        { id: "logo", src: "images/logo.png", alt: "Bomberman" },
        null
      )
    );
  if (count === 0) {
    container.removeChild(document.getElementById("waitingArea"));
    count++;
  }
  container.appendChild(gameGrid);
}

// Create the HUD with player lives and time countdown
function createHUD() {
  let Players = game.players;
  // Filter players that have a nickname, then map to create lives display
  const livesDisplay = Players.filter((player) => player.nickname).map(
    (player) => {
      return MyFramework.DOM(
        "div",
        {},
        `${player.nickname} ❤️: ${player.lives > 0 ? player.lives : "💔"}`
      );
    }
  );

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
  let Players = game.players;
  const timeDisplay = document.querySelector("#hud > div");
  if (timeDisplay) {
    timeDisplay.textContent = `Time: ${formatTime(countdown())}`;
  }
  // update player lives by player id
  setPlayerLives(
    playerLives().map((lives, index) => {
      return index === playerId ? lives - 1 : lives;
    })
  );
  const livesDisplay = document.querySelectorAll(
    "#hud > div:not(:first-child)"
  );
  const lives = playerLives();
  for (let i = 0; i < Players.length; i++) {
    if (Players[i].nickname !== "") {
      Players[i].lives = lives[i];
      if (Players[i].lives === 0) {
        livesDisplay[i].textContent = `${Players[i].nickname} 💔`;
      } else {
        livesDisplay[i].textContent = `${Players[i].nickname} ❤️: ${lives[i]}`;
      }
    }
  }
}
let timer;
// Start the countdown timer
function startTimer(time) {
  let Players = game.players;
  setCountdown(time); // 3 minutes
  timer = setInterval(() => {
    setCountdown(countdown() - 1);
    if (countdown() === 0) {
      clearInterval(timer);
      endGame();
    }
    updateHUD();
    // if only one player has lives remaining, end the game // should === 1 once we have more than 2 players
    if (Players.filter((player) => player.lives > 0).length === 1) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

// End the game when the countdown reaches 0
export function endGame(data) {
  clearInterval(timer);
  const HUD = document.getElementById("container");
  HUD.removeChild(document.getElementById("hud"));
  let Players = game.players;
  const gameGrid = document.getElementById("gameGrid");
  gameGrid.innerHTML = ""; // Clear the game grid
  // Display "Game Over" message
  const gameOver = MyFramework.DOM("h1", { class: "game-over" }, "Game Over!");
  gameGrid.appendChild(gameOver);

  // Determine the winner with the most lives remaining (if any) otherwise, no winner if all players have 0 lives or equal lives
  const maxLives = Math.max(...Players.map(player => player.lives));
  const winners = Players.filter(player => player.lives === maxLives);

  if (winners.length === 1 && maxLives > 0) {
    const winnerName = winners[0].nickname; // Get the winner's name
    // Display the winner
    const winnerDisplay = MyFramework.DOM(
      "h2",
      { class: "winner-display" },
      `${winnerName} is the winner!`
    );
    gameGrid.appendChild(winnerDisplay);
  } else {
    const noWinner = MyFramework.DOM(
      "h2",
      { class: "winner-display" },
      "No winner!"
    );
    gameGrid.appendChild(noWinner);
  }
  const newGameButton = MyFramework.DOM(
    "button",
    { class: "startNewGame", onclick: startNewGame },
    "startNewGame"
  );
  gameGrid.appendChild(newGameButton);
}

function startNewGame() {
  window.location.reload();
}
