// app.js

import { MyFramework } from "./vFw/framework.js";
import { showGameGrid, buildGame } from "./structure/buildGame.js";
import { minimumPlayers, maximumPlayers, minimumTime, maximumTime, game, wsUrl } from "./structure/model.js";
import { setPlayerNickname, setPlayersNicknames } from "./structure/helpers.js";
import { changeDirection, setKeyUp, playerGameOver } from './structure/bombermanMoves.js';
import { checkIfPlayerInBlastRadius, killPlayer } from "./structure/gameEvents.js";

const [playersReady, setPlayersReady] = MyFramework.State([]);
const [countdown, setCountdown] = MyFramework.State(maximumTime);
const [gameTimer, setGameTimer] = MyFramework.State(minimumTime);
const [ws, setWS] = MyFramework.State(null);
const neededPlayers = minimumPlayers;
let timer;
let gameStartTimer;

export const container = document.getElementById("app");
let chatMessages = [];

function connectToWebSocket(nickname) {
  console.log("Connecting to WebSocket server");
  console.log("Nickname", nickname);
  const newWS = new WebSocket(wsUrl);
  setWS(newWS);
  
  newWS.onopen = () => {
    console.log("Connected to WebSocket server");
    if (nickname && nickname.trim()) {
      console.log("Sending nickname to WebSocket server");
      newWS.send(JSON.stringify({ nickname }));
    } else {
      alert("Nickname cannot be empty");
    }
  };

  newWS.onmessage = function(message) {
    const data = JSON.parse(message.data);
    console.log("Data received", data.messageType, data);
    
    const messageHandlers = {
      welcome: handleWelcomeMessage,
      move: handleMoveMessage,
      keyUp: handleKeyUpMessage,
      chat: handleChatMessage,
      bombExplosion: handleBombExplosionMessage,
      killPlayer: handleKillPlayerMessage,
      youLost: handleYouLostMessage
    };

    const handler = messageHandlers[data.messageType];
    if (handler) handler(data);
  };

  newWS.onclose = () => {
    console.log("Disconnected from WebSocket server");
  };
}

function handleWelcomeMessage(data) {
  console.log("Welcome message received", data.numberofClients);
  setPlayersReady(data.numberofClients);
  setPlayersNicknames(data.clients);
  showWaitingArea();
  showChatBox();
  if (data.loadMessages) {
    chatMessages = data.loadMessages;
    loadExistingMessages();
  }
  if (data.numberofClients === maximumPlayers) {
    setCountdown(0);
  }
  game.gameGrid = data.gameGrid;
  game.gameId = data.gameId;
}

function handleMoveMessage({ id, direction }) {
  changeDirection(direction, id);
}

function handleKeyUpMessage({ id }) {
  setKeyUp(id);
}

function handleChatMessage({ nickname, message: chatMessage }) {
  const formattedMessage = `${nickname}: ${chatMessage.message}`;
  chatMessages.push(formattedMessage);
  addChatMessage(formattedMessage);
  console.log("Chat message received", chatMessages);
}

function handleBombExplosionMessage({ id: userId, bombPosition, directions }) {
  checkIfPlayerInBlastRadius(userId, bombPosition, directions);
}

function handleKillPlayerMessage({ id }) {
  killPlayer(id);
}

function handleYouLostMessage() {
  playerGameOver();
}

export function sendPlayerMove(direction) {
  sendWebSocketMessage({
    gameId: game.gameId,
    messageType: "move",
    direction: direction.key,
  });
}

export function sendkeyUp() {
  sendWebSocketMessage({
    gameId: game.gameId,
    messageType: 'keyUp'
  });
}

export function sendBombExplosion(bombPosition, directions) {
  sendWebSocketMessage({
    messageType: 'bombExplosion',
    gameId: game.gameId,
    bombPosition,
    directions
  });
}

export function sendKillPlayer(userId) {
  sendWebSocketMessage({
    messageType: 'killPlayer',
    gameId: game.gameId,
    userId
  });
}

export function sendplayerGameOver(nickname) {
  sendWebSocketMessage({
    messageType: 'gameover',
    nickname,
    gameId: game.gameId,
  });
}

function sendWebSocketMessage(message) {
  const websocket = ws();
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    console.log('WebSocket is open, sending message');
    websocket.send(JSON.stringify(message));
  } else {
    console.error('WebSocket is not open. Current state:', websocket ? websocket.readyState : 'undefined');
  }
}

export function showLandingPage() {
  const landingPage = createLandingPageElement();
  if (container) {
    updateOverlay();
    container.replaceChild(landingPage, document.getElementById("landingPage"));
  }
}

function createLandingPageElement() {
  return MyFramework.DOM(
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
    MyFramework.DOM("a", { href: "https://github.com/AhmedAlAli9402" }, "AhmedAlAli9402")
  );
}

function updateOverlay() {
  const overlay = document.getElementById("overlay");
  overlay.innerHTML = "";
  overlay.appendChild(MyFramework.DOM("h1", null, "Bomberman Game"));
  overlay.appendChild(MyFramework.DOM("img", {id:"logo", src: "images/logo.png", alt: "Bomberman"}, null));
}

function showNicknamePopup() {
  const nicknamePopup = createNicknamePopupElement();
  if (container) {
    container.replaceChild(
      nicknamePopup,
      document.getElementById("landingPage")
    );
  }
  setupNicknameInputListener();
}

function createNicknamePopupElement() {
  return MyFramework.DOM(
    "div",
    { id: "nicknamePopup", style: "display: flex;" },
    MyFramework.DOM("img", { src: "images/logo.png", alt: "Bomberman" }),
    MyFramework.DOM("p", null, "Enter your nickname to start the game"),
    MyFramework.DOM("input", {
      id: "nicknameInput",
      messageType: "text",
      placeholder: "Enter your nickname",
    }),
    MyFramework.DOM(
      "button",
      { id: "submitnicknameButton", onclick: submitNickname },
      "Submit"
    )
  );
}

function setupNicknameInputListener() {
  document
    .getElementById("nicknameInput")
    .addEventListener("keyup", function(event) {
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
  const waitingArea = createWaitingAreaElement();
  if (container) {
    container.innerHTML = "";
    container.appendChild(waitingArea);
  }
  if (playersReady() >= neededPlayers) {
    startCountdown();
  }
}

function createWaitingAreaElement() {
  return MyFramework.DOM(
    "div",
    { id: "waitingArea", style: "display: flex;" },
    MyFramework.DOM(
      "h1",
      { id: "waitingMessage" },
      "Waiting for more players..."
    ),
    MyFramework.DOM(
      "h2",
      { id: "countPlayers" },
      `[2-4 players needed] Players ready: ${playersReady()}`
    ),
    MyFramework.DOM(
      "h1",
      { id: "countdownTimer" },
      `Closing in ${countdown()} seconds...`
    ),
    createInstructionsElement()
  );
}

function createInstructionsElement() {
  const instructionsContent = [
    { img: "images/bomb.png", text: "You can place a bomb using the x key." },
    { img: "images/arrowKeys.png", text: "You can move your player using the arrow keys." },
    { img: "images/wall/wall.png", text: "This wall cannot be broken or walked over." },
    { img: "images/wall/wall100.png", text: "This wall can be broken by placing a bomb near it (some walls contain power-ups)." },
    { img: "images/powerUps/speedPowerUp.png", text: "The skate power-up allows you to skate by holding down an arrow key." },
    { img: "images/powerUps/PowerBombPowerUp.png", text: "The power bomb power-up makes the bombs you drop twice as powerful." },
    { img: "images/powerUps/extraBombPowerUp.png", text: "The extra bomb power-up allows you to drop two bombs at the same time." },
  ];

  const instructionsItems = instructionsContent.map((item) =>
    MyFramework.DOM(
      "div",
      { class: "instruction-item" },
      MyFramework.DOM("img", { src: item.img, alt: "Bomberman" }),
      MyFramework.DOM("p", {}, item.text)
    )
  );

  return MyFramework.DOM(
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
}

function startCountdown() {
  clearInterval(timer);
  setCountdown(maximumTime);
  document.getElementById("waitingMessage").style.display = "none";
  document.getElementById("countdownTimer").style.display = "block";
  timer = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  if (countdown() !== 0) {
    setCountdown(countdown() - 1);
  }
  document.getElementById("countdownTimer").textContent = `Closing in ${countdown()} seconds...`;
  if (countdown() === 0) {
    clearInterval(timer);
    createNewGameinServer();
    startGameTimer();
  }
}

function startGameTimer() {
  clearInterval(gameStartTimer);
  setGameTimer(minimumTime);
  gameStartTimer = setInterval(updateGameTimer, 1000);
}

function updateGameTimer() {
  setGameTimer(gameTimer() - 1);
  document.getElementById("countdownTimer").textContent = `Starting in ${gameTimer()} seconds...`;

  if (gameTimer() === 0) {
    clearInterval(gameStartTimer);
    showGameGrid();
    requestAnimationFrame(() => buildGame(game.gameGrid));
  }
}

function showChatBox() {
  const chatBox = createChatBoxElement();
  container.appendChild(chatBox);
  loadExistingMessages();
  setupChatInputListener();
}

function createChatBoxElement() {
  return MyFramework.DOM(
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
}

function setupChatInputListener() {
  document
    .getElementById("chatInput")
    .addEventListener("keyup", function(event) {
      if (event.key === "Enter") {
        sendMessage();
      }
    });
}

function addChatMessage(msg) {
  const chatMessage = MyFramework.DOM("li", {}, msg);
  const chatMessagesList = document.getElementById("chatList");
  chatMessagesList.appendChild(chatMessage);
  const chatMessages = document.getElementById("chatMessages");
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
  const message = document.getElementById("chatInput").value.trim();
  if (message && ws()) {
    sendWebSocketMessage({ gameId: game.gameId, messageType: "chat", message });
    document.getElementById("chatInput").value = "";
  }
}

function loadExistingMessages() {
  const chatMessagesList = document.getElementById("chatList");
  chatMessagesList.innerHTML = "";
  chatMessages.forEach(addChatMessage);
}

showLandingPage();

function createNewGameinServer() {
  sendWebSocketMessage({ gameId: game.gameId, messageType: "newGame" });
}
