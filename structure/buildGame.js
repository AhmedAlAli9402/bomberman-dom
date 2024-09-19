import { MyFramework } from "../vFw/framework.js"; // Import custom framework
import { game } from "./model.js"; // Import game state
import { formatTime } from "./helpers.js"; // Helper function to format time
import { container } from "../app.js"; // Main container element
import { countdown, setCountdown } from "./model.js"; // Game countdown timer
import { sendPlayerMove, sendkeyUp, sendplayerGameOver, sendPlaceBomb, update } from "../app.js"; // Event sending functions

// Store available squares on the grid
export let availableSquares = [];

// Initial lives for each player (4 players with 3 lives each)
export let initialLives = [3, 3, 3, 3];

// Initialize player lives as reactive state
export const [playerLives, setPlayerLives] = MyFramework.State([
  ...initialLives,
]);

// Function to build the game board/grid based on data sent from the server
export function buildGame() {
  let Players = game.players;
  const gameGrid = game.gameGrid;
  const grid = document.getElementById("grid");

  // Create divs for each square in the grid and assign unique IDs
  for (let i = 0; i < gameGrid.allsquares.length; i++) {
    const square = MyFramework.DOM("div", { id: i });
    grid.appendChild(square);
  }

  // Create walls by assigning "wall" class to specific squares
  const createWall = (index) =>
    document.getElementById(index.toString()).classList.add("wall");

  for (const wall of gameGrid.wall) {
    createWall(wall);
  }

  // Create breakable walls by assigning "breakableWall" class
  const createBreakableWall = (index) =>
    document.getElementById(index).classList.add("breakableWall");

  for (const breakableWall of gameGrid.breakableWall) {
    createBreakableWall(breakableWall);
  }

  // Add power-ups to the grid based on server data
  const createPowerUp = (index, powerUp) => {
    const square = document.getElementById(index);
    square.classList.add(powerUp);
  };

  for (const { index, powerUp } of gameGrid.powerUp) {
    createPowerUp(index, powerUp);
  }

  availableSquares = Array.from(document.querySelectorAll(".grid div"));

  // Set starting positions for each player
  for (let i = 0; i < Players.length; i++) {
    if (Players[i].nickname !== "") {
      const { x, y } = Players[i].startPosition;

      if (typeof x === "number" && typeof y === "number") {
        const playerSquareIndex = y * gameGrid.width + x;

        if (
          playerSquareIndex >= 0 &&
          playerSquareIndex < availableSquares.length
        ) {
          const playerSquare = availableSquares[playerSquareIndex];
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

  // Ensure no blocked paths and initialize the game
  startTimer(countdown());
  initializePlayer();
}

// Tracks key states for movement and actions
const keyStates = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  x: false, // Key for placing bombs
};

// Initialize player controls and event listeners for movement
function initializePlayer() {
  document.getElementById("gameGrid").setAttribute("tabindex", "0");

  // Event listener for keydown (player movement)
  document.getElementById("gameGrid").addEventListener("keydown", function (event) {
    const key = event.key;
    if (key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight") {
      update(sendPlayerMove(event)); // Send move event to server
    } else if (key === "x") {
      if (!keyStates[key]) {
        keyStates[key] = true; // Mark key as pressed
        update(sendPlaceBomb(event)); // Send bomb placement event to server
      }
    }
  });

  // Event listener for keyup (player stops moving or releases bomb key)
  document.addEventListener("keyup", (event) => {
    const key = event.key;
    if (keyStates.hasOwnProperty(key)) {
      keyStates[key] = false; // Mark key as released
      update(sendkeyUp(event)); // Send key up event to server
    }
  });
}

// Display the game grid and HUD
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

// Create HUD (heads-up display) with player lives and timer
function createHUD() {
  let Players = game.players;

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
    ...livesDisplay
  );

  return hud;
}

// Update the HUD when player lives change
export function updateHUD(playerId) {
  let Players = game.players;
  const timeDisplay = document.querySelector("#hud > div");
  if (timeDisplay) {
    timeDisplay.textContent = `Time: ${formatTime(countdown())}`;
  }

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

// Timer to count down and end the game after a set time
let timer;
function startTimer(time) {
  let Players = game.players;
  setCountdown(time); // Set initial countdown (e.g., 3 minutes)

  timer = setInterval(() => {
    setCountdown(countdown() - 1);
    if (countdown() === 0) {
      clearInterval(timer);
      endGame();
    }
    updateHUD();
    // End game if only one player has lives remaining
    if (Players.filter((player) => player.lives > 0).length === 1) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

// End the game and display the winner or "No winner!"
export function endGame() {
  clearInterval(timer);
  const HUD = document.getElementById("container");
  HUD.removeChild(document.getElementById("hud"));
  
  let Players = game.players;
  const gameGrid = document.getElementById("gameGrid");
  gameGrid.innerHTML = ""; // Clear the grid

  // Display "Game Over" message
  const gameOver = MyFramework.DOM("h1", { class: "game-over" }, "Game Over!");
  gameGrid.appendChild(gameOver);

  // Determine winner based on lives remaining
  const maxLives = Math.max(...Players.map(player => player.lives));
  const winners = Players.filter(player => player.lives === maxLives);

  if (winners.length === 1 && maxLives > 0) {
    const winnerName = winners[0].nickname;
    const winnerDisplay = MyFramework.DOM(
      "h2",
      { class: "winner-display" },
      `${winnerName} is the winner!`
    );
    gameGrid.appendChild(winnerDisplay);
    update(sendplayerGameOver(winners[0].id)); // Send winner information to server
  } else {
    const noWinner = MyFramework.DOM("h2", { class: "winner-display" }, "No winner!");
    gameGrid.appendChild(noWinner);
  }
}
