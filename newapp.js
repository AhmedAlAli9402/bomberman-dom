// app.js

import { MyFramework } from "./vFw/framework.js";
import {
  showGameGrid,
  buildGame,
  updateHUD,
} from "./structure/buildGame.js";
import {
  game,
  wsUrl,
} from "./structure/model.js";
const [playersReady, setPlayersReady] = MyFramework.State([]);
import {
  changeDirection,
  setKeyUp,
  playerGameOver,
  moveBomberman,
} from "./structure/bombermanMoves.js";
import {
  checkIfPlayerInBlastRadius,
  killPlayer,
} from "./structure/gameEvents.js";

// set the countdown to the minimum time or maximum time
const [countdown, setCountdown] = MyFramework.State(10);

// Get the container element
export const container = document.getElementById("app");
let ws;
let chatMessages = [];

function connectToWebSocket(nickname) {
  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log("Connected to WebSocket server");
    if (nickname && nickname.trim()) {
      ws.send(JSON.stringify({ nickname })); // Send the nickname in the first message
    } else {
      alert("Nickname cannot be empty");
    }
  };

  ws.onmessage = function (message) {
    const data = JSON.parse(message.data);
    handleServerMessage(data);
  };

  ws.onclose = () => {
    ws.send(JSON.stringify({ message: { messageType: "disconnect" } }));
    console.log("Disconnected from WebSocket server");
  };
}

// New function to handle messages from the server
function handleServerMessage(data) {
  switch (data.messageType) {
    case "welcome":
      handleWelcomeMessage(data);
      break;
    case "lockIn":
      startCountdownLockin(data); // Start the lock-in countdown
      break;
    case "updateTimer":
      handleUpdateTimer(data); // Handle lock-in timer update
      break;
    case "lastChance":
      startCountGameStarting(data); // Notify about last chance to join
      break;
    case "gameStarted":
      handleGameStartedMessage(data); // Start the game
      break;
    case "updatePosition":
      handlePlayerMove(data); // Handle player movement
      break;
    case "keyUp":
      handleKeyUp(data); // Handle key release event
      break;
    case "chat":
      handleChatMessage(data); // Handle chat messages
      break;
    case "updateGameState":
      syncGameState(data); // Sync the game state with the server
      break;
    case "bombExplosion":
      handleBombExplosion(data); // Handle bomb explosion events
      break;
    case "killPlayer":
      handleKillPlayer(data); // Handle player elimination
      break;
    case "updateHUD":
      // Update the HUD with the latest game state
      // updateHUD(data);
      break;
    case "youLost":
      playerGameOver(); // Handle player game over event
      break;
    default:
      console.warn("Unknown message type:", data.messageType); // Warn if an unknown message type is received
  }
}

function handleWelcomeMessage(data) {
  setPlayersReady(data.numberofClients);
  showWaitingArea();
  showChatBox();
  if (data.loadMessages) {
    chatMessages = data.loadMessages;
    loadExistingMessages();
  }
}

function handlePlayerMove(data) {
  game.gameGrid = data.currentGame.gameGrid;
  game.players = data.currentGame.players;
  
  const { id, direction } = data;
  changeDirection(direction, id);
}

function handleKeyUp(data) {
  const { id } = data;
  window.requestAnimationFrame(() => setKeyUp(id));
}

function handleChatMessage(data) {
  const { nickname, message: chatMessage } = data;
  chatMessages.push(`${nickname}: ${chatMessage.message}`); // Store the message
  addChatMessage(`${nickname}: ${chatMessage.message}`); // Add to the chat
}

function syncGameState(data) {
  // Update the local game state based on the server's game state
  // For example, this could include player positions, scores, etc.
  console.log("Syncing game state", data);
  game.gameGrid = data.gameGrid;
  game.players = data.players;
}

function handleBombExplosion(data) {
  let userId = data.id;
  let bombPosition = data.bombPosition;
  let directions = data.directions;
  window.requestAnimationFrame(() => {
    checkIfPlayerInBlastRadius(userId, bombPosition, directions);
  });
}

function handleKillPlayer(data) {
  const { id } = data;
  killPlayer(id);
}

function handleGameStartedMessage(data) {
  console.log("Game started", data);
  game.gameGrid = data.currentGame.gameGrid;
  game.players = data.currentGame.players;
  game.gameId = data.game
  game.gameTimer = data.currentGame.timer;

  showGameGrid();
  buildGame();
}

export function sendkeyUp() {
  console.log("sendkeyUp");
  if (ws) {
    ws.send(
      JSON.stringify({
        message: {
          gameId: game.gameId,
          messageType: "keyUp",
        },
      })
    );
  }
}

export function sendBombExplosion(bombPosition, directions) {
  console.log("checkPlayer");
  if (ws) {
    ws.send(
      JSON.stringify({
        message: {
          messageType: "bombExplosion",
          gameId: game.gameId,
          bombPosition: bombPosition,
          directions: directions,
        },
      })
    );
  }
}

export function sendKillPlayer(userId) {
  console.log("sendKillPlayer");
  if (ws) {
    ws.send(
      JSON.stringify({
        message: {
          messageType: "killPlayer",
          gameId: game.gameId,
          userId: userId,
        },
      })
    );
  }
}

export function sendplayerGameOver(nickname) {
  if (ws) {
    ws.send(
      JSON.stringify({
        message: {
          messageType: "gameover",
          nickname: nickname,
          gameId: game.gameId,
        },
      })
    );
  }
}

export function sendPlayerMove(direction) {
  console.log("sendPlayerMove", "direction", direction.key);
  if (ws) {
    ws.send(
      JSON.stringify({
        message: {
          gameId: game.gameId,
          messageType: "move",
          direction: direction.key,
        },
      })
    );
  }
}

// Define the landing page
export function showLandingPage() {
  const landingPage = MyFramework.DOM(
    "div",
    { id: "landingPage", style: "display: flex;" },
    MyFramework.DOM("img", { src: "images/logo.png", alt: "Bomberman" }),
    MyFramework.DOM(
      "button",
      { id: "startGameButton", onclick: showNicknamePopup },
      "Start Game"
    ),
    MyFramework.DOM("h3", {}, "A better Bomberman Game by Elites Seniors! 👴 "),
    MyFramework.DOM("a", { href: "https://github.com/amali01" }, "amali01"),
    MyFramework.DOM("a", { href: "https://github.com/sahmedG" }, "sahmedG"),
    MyFramework.DOM("a", { href: "https://github.com/MSK17A" }, "MSK17A"),
    MyFramework.DOM(
      "a",
      { href: "https://github.com/AhmedAlAli9402" },
      "AhmedAlAli9402"
    )
  );
  if (container) {
    const upper = document.querySelector(".main");
    const overlay = MyFramework.DOM(
      "div",
      { id: "overlay" },
      MyFramework.DOM(
        "div",
        { id: "container" },
        MyFramework.DOM("h1", null, "Bomberman Game")
      ),
      MyFramework.DOM("img", {
        id: "logo",
        src: "images/logo.png",
        alt: "Bomberman",
      })
    );
    upper.replaceChild(overlay, document.getElementById("overlay"));
    container.replaceChild(landingPage, document.getElementById("landingPage"));
  }
}

// Show the nickname popup
function showNicknamePopup() {
  const nicknameInput = MyFramework.DOM("input", {
    id: "nicknameInput",
    messageType: "text",
    placeholder: "Enter your nickname",
  });

  const submitButton = MyFramework.DOM(
    "button",
    { id: "submitnicknameButton", onclick: submitNickname },
    "Submit"
  );

  const nicknamePopup = MyFramework.DOM(
    "div",
    { id: "nicknamePopup", style: "display: flex;" },
    MyFramework.DOM("img", { src: "images/logo.png", alt: "Bomberman" }),
    MyFramework.DOM("p", null, "Enter your nickname to start the game"),
    nicknameInput,
    submitButton
  );
  if (container) {
    container.replaceChild(
      nicknamePopup,
      document.getElementById("landingPage")
    );
  }
  document
    .getElementById("nicknameInput")
    .addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        submitNickname();
      }
    });
}

// Submit the nickname and navigate to the waiting area
function submitNickname() {
  let nickname = document.getElementById("nicknameInput").value.trim();
  if (!nickname) {
    nickname = `Player ${playersReady().toString()}`;
  } else if (nickname.length > 10) {
    nickname = nickname.slice(0, 10);
  }
  connectToWebSocket(nickname);
}

// Show the waiting area
function showWaitingArea() {
  const waitingMessage = MyFramework.DOM(
    "h1",
    { id: "waitingMessage" },
    "Waiting for more players..."
  );

  const countPlayers = MyFramework.DOM(
    "h2",
    { id: "countPlayers" },
    `[2-4 players needed] Players ready: ${playersReady()}`
  );

  const countdownTimer = MyFramework.DOM(
    "h1",
    { id: "countdownTimer" },
    `Starting in ${countdown()} seconds...`
  );

  const instructionsContent = [
    { img: "images/bomb.png", text: "You can place a bomb using the x key." },
    {
      img: "images/arrowKeys.png",
      text: "You can move your player using the arrow keys.",
    },
    {
      img: "images/wall/wall.png",
      text: "This wall cannot be broken or walked over.",
    },
    {
      img: "images/wall/wall100.png",
      text: "This wall can be broken by placing a bomb near it (some walls contain power-ups).",
    },
    {
      img: "images/powerUps/speedPowerUp.png",
      text: "The skate power-up allows you to skate by holding down an arrow key.",
    },
    {
      img: "images/powerUps/PowerBombPowerUp.png",
      text: "The power bomb power-up makes the bombs you drop twice as powerful.",
    },
    {
      img: "images/powerUps/extraBombPowerUp.png",
      text: "The extra bomb power-up allows you to drop two bombs at the same time.",
    },
  ];

  const instructionsItems = instructionsContent.map((item) =>
    MyFramework.DOM(
      "div",
      { class: "instruction-item" },
      MyFramework.DOM("img", { src: item.img, alt: "Bomberman" }),
      MyFramework.DOM("p", {}, item.text)
    )
  );

  const instructionsPage = MyFramework.DOM(
    "div",
    { id: "instructionsPage" },
    MyFramework.DOM("h3", { class: "instruction-title" }, "Instructions"),
    MyFramework.DOM(
      "h3",
      { class: "instruction-objective" },
      "The objective of the game is to eliminate all other players by placing bombs."
    ),
    ...instructionsItems
  );

  const waitingArea = MyFramework.DOM(
    "div",
    { id: "waitingArea", style: "display: flex;" },
    waitingMessage,
    countPlayers,
    countdownTimer,
    instructionsPage
  );

  if (container) {
    container.innerHTML = "";
    // container.replaceChild(waitingArea, document.getElementById("nicknamePopup"));
    container.appendChild(waitingArea);
  }
}

let countdownInterval; // Store the interval ID to clear it later if needed

// Function to start the lock-in countdown
function startCountdownLockin(data) {
  setCountdown(data.remainingTime);

  const waitingMessageEl = document.getElementById("waitingMessage");
  const countdownTimerEl = document.getElementById("countdownTimer");

  if (waitingMessageEl) waitingMessageEl.style.display = "none";
  if (countdownTimerEl) countdownTimerEl.style.display = "block";

  countdownTimerEl.textContent = `${data.message}`;
}

// Function to start the game countdown
function startCountGameStarting(data) {
  setCountdown(data.remainingTime);
  const countdownTimerEl = document.getElementById("countdownTimer");

  countdownTimerEl.textContent = ``;
  countdownTimerEl.textContent = `${data.message}`;

}

// Function to handle the updateTimer message from the server
function handleUpdateTimer(data) {
  const { remainingTime, message } = data;

  if (remainingTime != null) {
    // Update the countdown based on the received remaining time
    setCountdown(remainingTime);

    // Update the message if provided
    if (message) {
      const countdownTimerEl = document.getElementById("countdownTimer");
      if (countdownTimerEl) {
        // clear old textcontent
        countdownTimerEl.textContent = "";
        countdownTimerEl.textContent = `${message}`;
      }
    }
  }
}

// chat box
function showChatBox() {
  const chatBox = MyFramework.DOM(
    "div",
    { id: "chatBox" },
    MyFramework.DOM(
      "div",
      { id: "chatMessages" },
      MyFramework.DOM("ul", { id: "chatList" })
    ),
    MyFramework.DOM(
      "div",
      { id: "chatInputContainer" },
      MyFramework.DOM("input", {
        id: "chatInput",
        messageType: "text",
        placeholder: "Type your message here...",
      }),
      MyFramework.DOM(
        "button",
        { id: "sendMessageButton", onclick: sendMessage },
        "Send"
      )
    )
  );
  container.appendChild(chatBox);
  // container.replaceChild(chatBox, document.getElementById("chatbox"));

  // Load existing messages if any
  for (const msg of chatMessages) {
    addChatMessage(msg);
  }

  // chatMessages.forEach(msg => addChatMessage(msg));

  document
    .getElementById("chatInput")
    .addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        sendMessage();
      }
    });
}

function addChatMessage(msg) {
  const chatMessage = MyFramework.DOM("li", {}, msg);
  const chatMessagesList = document.getElementById("chatList");
  chatMessagesList.appendChild(chatMessage);
  document.getElementById("chatMessages").scrollTop =
    document.getElementById("chatMessages").scrollHeight;
}

function sendMessage() {
  const message = document.getElementById("chatInput").value.trim();
  if (message) {
    if (ws) {
      ws.send(
        JSON.stringify({
          message: { gameId: game.gameId, messageType: "chat", message },
        })
      );
      // addChatMessage(`You: ${message}`); // Show the sent message immediately
      document.getElementById("chatInput").value = ""; // Clear input
    }
  }
}

function loadExistingMessages() {
  //check if the same message is already loaded
  const chatMessagesList = document.getElementById("chatList");
  chatMessagesList.innerHTML = "";
  for (const msg of chatMessages) {
    addChatMessage(msg);
  }
}

// Start the app with the landing page
window.requestAnimationFrame(showLandingPage);

function createNewGameinServer() {
  if (ws) {
    ws.send(
      JSON.stringify({
        message: { gameId: game.gameId, messageType: "newGame" },
      })
    );
  }
}
