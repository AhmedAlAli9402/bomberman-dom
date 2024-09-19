// app.js

import { MyFramework } from "./vFw/framework.js";
import { showGameGrid, buildGame, endGame } from "./structure/buildGame.js";
import { game, wsUrl, updateGame } from "./structure/model.js";
import { setKeyUp, playerGameOver, moveBomberman, dropBomb, resetBombermanPosition } from "./structure/bombermanMoves.js";
import { checkGameStructure, killPlayer } from "./structure/gameEvents.js";

const [playersReady, setPlayersReady] = MyFramework.State([]);
const [countdown, setCountdown] = MyFramework.State(10);

export const container = document.getElementById("app");
const [ws, setWs] = MyFramework.State(null);
let chatMessages = [];

function connectToWebSocket(nickname) {
  console.log("Connecting to WebSocket server");
  console.log("Nickname", nickname);
  const newWS = new WebSocket(wsUrl);
  setWs(newWS);

  newWS.onopen = () => {
    console.log("Connected to WebSocket server");
    if (nickname && nickname.trim()) {
      newWS.send(JSON.stringify({ messageType: "firstConnect", nickname: nickname }));
    } else {
      alert("Nickname cannot be empty");
    }
  };

  newWS.onmessage = (message) => handleServerMessage(JSON.parse(message.data));

  newWS.onclose = () => {
    newWS.send(JSON.stringify({ message: { messageType: "disconnect" } }));
    console.log("Disconnected from WebSocket server");
  };
}

function handleServerMessage(data) {
  const handlers = {
    welcome: handleWelcomeMessage,
    lockIn: startCountdownLockin,
    updateTimer: handleUpdateTimer,
    lastChance: startCountGameStarting,
    gameStarted: handleGameStartedMessage,
    updatePosition: handlePlayerMove,
    invalidMove: () => console.log("Invalid move"),
    keyUp: handleKeyUp,
    chat: handleChatMessage,
    updateGameState: syncGameState,
    placeBomb: (data) => { checkGameStructure(data.currentGame.gameGrid); dropBomb(data.currentGame.players[data.id]); },
    killPlayer: handleKillPlayer,
    updateHUD: (data) => console.log("Update HUD", data.gameTimer),
    disconnect: handleChatMessage,
    winnerByDefault: endGame,
    gameOver: (data) => { console.log("Game Over", data); endGame(data); },
    youLost: (data) => { console.log("You lost", data); updateGame(data.currentGame); playerGameOver(data.id); },
  };
console.log("new message",data.messageType)
  const handler = handlers[data.messageType];
  if (handler) {
    handler(data);
  } else {
    console.warn("Unknown message type:", data.messageType);
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
  const { id, direction, currentGame } = data;
  checkGameStructure(currentGame.gameGrid);
  updateGame(currentGame); 
  if (direction === "reset") {
    resetBombermanPosition(id, data.newPosition);
  } else {
    moveBomberman(direction, id);
  }
}

function handleKeyUp(data) {
  window.requestAnimationFrame(() => setKeyUp(data.id));
}

function handleChatMessage(data) {
  const { nickname, message: chatMessage } = data;
  const messageText = data.messageType === "disconnect"
    ? `${nickname} has left the game`
    : `${nickname}: ${chatMessage.message}`;
  chatMessages.push(messageText);
  addChatMessage(messageText);
}

function syncGameState(data) {
  console.log("Syncing game state", data);
  game.players = data.players;
}

function handleKillPlayer(data) {
  killPlayer(data.id);
}

function handleGameStartedMessage(data) {
  console.log("Game started", data);
  Object.assign(game, {
    gameGrid: data.currentGame.gameGrid,
    players: data.currentGame.players,
    gameId: data.gameId,
    gameTimer: data.currentGame.timer
  });
  updateGame(game);
  showGameGrid();
  buildGame();
}

export function sendWebSocketMessage(messageType, additionalData = {}) {
  if (ws()) {
    ws().send(JSON.stringify({
      message: {
        messageType,
        gameId: game.gameId,
        ...additionalData
      }
    }));
  }
}

export const sendkeyUp = () => sendWebSocketMessage("keyUp");
export const sendKillPlayer = (userId) => sendWebSocketMessage("killPlayer", { userId });
export const sendplayerGameOver = (nickname) => sendWebSocketMessage("gameover", { nickname });
export const sendPlayerMove = (direction) => sendWebSocketMessage("move", { direction: direction.key, gameGrid: game.gameGrid });
export const sendPlaceBomb = () => sendWebSocketMessage("placeBomb");

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
    ...["amali01", "sahmedG", "MSK17A", "AhmedAlAli9402"].map(username =>
      MyFramework.DOM("a", { href: `https://github.com/${username}` }, username)
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

function showNicknamePopup() {
  const nicknamePopup = MyFramework.DOM(
    "div",
    { id: "nicknamePopup", style: "display: flex;" },
    MyFramework.DOM("img", { src: "images/logo.png", alt: "Bomberman" }),
    MyFramework.DOM("p", null, "Enter your nickname to start the game"),
    MyFramework.DOM("input", {
      id: "nicknameInput",
      type: "text",
      placeholder: "Enter your nickname",
      autofocus: true,
    }),
    MyFramework.DOM(
      "button",
      { id: "submitnicknameButton", onclick: submitNickname },
      "Submit"
    )
  );

  if (container) {
    container.replaceChild(nicknamePopup, document.getElementById("landingPage"));
  }

  document.getElementById("nicknameInput").addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      submitNickname();
    }
  });
}

function submitNickname() {
  let nickname = document.getElementById("nicknameInput").value.trim();
  if (!nickname) {
    nickname = `Player ${playersReady().toString()}`;
  } else if (nickname.length > 10) {
    nickname = nickname.slice(0, 10);
  }
  connectToWebSocket(nickname);
}

function showWaitingArea() {
  const instructionsContent = [
    { img: "images/bomb.png", text: "You can place a bomb using the x key." },
    { img: "images/arrowKeys.png", text: "You can move your player using the arrow keys." },
    { img: "images/wall/wall.png", text: "This wall cannot be broken or walked over." },
    { img: "images/wall/wall100.png", text: "This wall can be broken by placing a bomb near it (some walls contain power-ups)." },
    { img: "images/powerUps/speedPowerUp.png", text: "The skate power-up allows you to skate by holding down an arrow key." },
    { img: "images/powerUps/PowerBombPowerUp.png", text: "The power bomb power-up makes the bombs you drop twice as powerful." },
    { img: "images/powerUps/extraBombPowerUp.png", text: "The extra bomb power-up allows you to drop two bombs at the same time." },
  ];

  const waitingArea = MyFramework.DOM(
    "div",
    { id: "waitingArea", style: "display: flex;" },
    MyFramework.DOM("h1", { id: "waitingMessage" }, "Waiting for more players..."),
    MyFramework.DOM("h2", { id: "countPlayers" }, `[2-4 players needed] Players ready: ${playersReady()}`),
    MyFramework.DOM("h1", { id: "countdownTimer" }, `Starting in ${countdown()} seconds...`),
    MyFramework.DOM(
      "div",
      { id: "instructionsPage" },
      MyFramework.DOM("h3", { class: "instruction-title" }, "Instructions"),
      MyFramework.DOM("h3", { class: "instruction-objective" }, "The objective of the game is to eliminate all other players by placing bombs."),
      ...instructionsContent.map(item =>
        MyFramework.DOM(
          "div",
          { class: "instruction-item" },
          MyFramework.DOM("img", { src: item.img, alt: "Bomberman" }),
          MyFramework.DOM("p", {}, item.text)
        )
      )
    )
  );

  if (container) {
    container.innerHTML = "";
    container.appendChild(waitingArea);
  }
}

function startCountdownLockin(data) {
  setCountdown(data.remainingTime);
  const waitingMessageEl = document.getElementById("waitingMessage");
  const countdownTimerEl = document.getElementById("countdownTimer");
  if (waitingMessageEl) waitingMessageEl.style.display = "none";
  if (countdownTimerEl) {
    countdownTimerEl.style.display = "block";
    countdownTimerEl.textContent = data.message;
  }
}

function startCountGameStarting(data) {
  setCountdown(data.remainingTime);
  const countdownTimerEl = document.getElementById("countdownTimer");
  if (countdownTimerEl) {
    countdownTimerEl.textContent = data.message;
  }
}

function handleUpdateTimer(data) {
  const { remainingTime, message } = data;
  if (remainingTime != null) {
    setCountdown(remainingTime);
    if (message) {
      const countdownTimerEl = document.getElementById("countdownTimer");
      if (countdownTimerEl) {
        countdownTimerEl.textContent = message;
      }
    }
  }
}

function showChatBox() {
  const chatBox = MyFramework.DOM(
    "div",
    { id: "chatBox" },
    MyFramework.DOM("div", { id: "chatMessages" }, MyFramework.DOM("ul", { id: "chatList" })),
    MyFramework.DOM(
      "div",
      { id: "chatInputContainer" },
      MyFramework.DOM("input", {
        id: "chatInput",
        messageType: "text",
        placeholder: "Type your message here...",
      }),
      MyFramework.DOM("button", { id: "sendMessageButton", onclick: sendMessage }, "Send")
    )
  );
  container.appendChild(chatBox);

  loadExistingMessages();

  document.getElementById("chatInput").addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
}

function addChatMessage(msg) {
  const chatMessage = MyFramework.DOM("li", {}, msg);
  const chatMessagesList = document.getElementById("chatList");
  chatMessagesList.appendChild(chatMessage);
  const chatMessagesContainer = document.getElementById("chatMessages");
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

function sendMessage() {
  const chatInput = document.getElementById("chatInput");
  const message = chatInput.value.trim();
  if (message && ws()) {
    ws().send(JSON.stringify({
      message: {
        gameId: game.gameId,
        messageType: "chat",
        message
      }
    }));
    chatInput.value = "";
  }
}

function loadExistingMessages() {
  const chatMessagesList = document.getElementById("chatList");
  chatMessagesList.innerHTML = "";
  chatMessages.forEach(addChatMessage);
}

window.requestAnimationFrame(showLandingPage);

// function createNewGameinServer() {
//   if (ws()) {
//     ws().send(JSON.stringify({
//       message: {
//         gameId: game.gameId,
//         messageType: "newGame"
//       }
//     }));
//   }
// }
