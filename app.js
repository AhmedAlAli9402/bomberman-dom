// app.js

import { MyFramework } from "./vFw/framework.js";
import { showGameGrid ,buildGame, deinitializePlayer } from "./structure/buildGame.js";
import { minimumPlayers , maximumPlayers , minimumTime, maximumTime, game ,wsUrl } from "./structure/model.js";
import {setPlayerNickname,setPlayersNicknames} from "./structure/helpers.js";
const [playersReady, setPlayersReady] = MyFramework.State([]);
import { changeDirection,setKeyUp, playerGameOver } from './structure/bombermanMoves.js';

// set the countdown to the minimum time or maximum time
// let countdown = minimumTime;
const [countdown, setCountdown] = MyFramework.State(10);

// set the needed players
let neededPlayers = minimumPlayers; // for mini of 2 players
// let neededPlayers = 1 ; // for testing with 1 player
let timer;

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
    console.log("Data received", data);
    if (data.messageType === "welcome") {
      console.log("Welcome message received", data.numberofClients);
      setPlayersReady(data.numberofClients);
      setPlayersNicknames(data.clients);
      showWaitingArea();
      showChatBox();
      if (data.loadMessages) {
        chatMessages = data.loadMessages
        loadExistingMessages();
      }
      game.gameGrid = data.gameGrid;
    } else if (data.type === "move") {
      const { id, direction } = data;
      changeDirection(direction, id);
    } else if (data.type === "keyUp") {
      const { id } = data;
      setKeyUp(id);
    } else if (data.messageType === "chat") {
      const { nickname, message: chatMessage } = data;
      chatMessages.push(`${nickname}: ${chatMessage.message}`); // Store the message
      addChatMessage(`${nickname}: ${chatMessage.message}`); // Add to the chat
      console.log("Chat message received", chatMessages);
    } else if (data.type === "gameState") {
      // Handle syncing the game state on new connection
    } else if (data.type === 'youDied') {
      deinitializePlayer()
      playerGameOver()
    }
  };

  ws.onclose = () => {
    console.log("Disconnected from WebSocket server");
  };
}


export function sendPlayerMove(direction) {
  console.log("sendPlayerMove", "direction", direction.key);
  if (ws) {
    ws.send(
      JSON.stringify({
        message: {
          type: "move",
          direction: direction.key,
        },
      })
    );
  }
}

    export  function sendkeyUp() {
      console.log('sendkeyUp' );
      if (ws) {
        ws.send(JSON.stringify({
          message: {
            type: 'keyUp'
          }
        }));
      }
    }
    
    export function sendplayerGameOver(nickname) {
      console.log('sendplayerGameOver' );
      if (ws) {
        ws.send(JSON.stringify({
          message: {
            type: 'gameover',
            nickname: nickname
          }
        }));
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
    container.replaceChild(landingPage, document.getElementById("landingPage"));
  }
}

// Show the nickname popup
function showNicknamePopup() {
  const nicknameInput = MyFramework.DOM("input", {
    id: "nicknameInput",
    type: "text",
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

  // Add the nickname and proceed
  // setPlayersReady(playersReady() + 1);
  // setPlayerNickname(playersReady() - 1, nickname);
  // showWaitingArea();
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
    container.appendChild(waitingArea);
  }

  if (playersReady() >= neededPlayers) {
    startCountdown();
  }
}

// Start the countdown timer
function startCountdown() {
  // clear the timer if it's already running and set the countdown
  clearInterval(timer);
  setCountdown(maximumTime);
// hide countPlayers,waitingMessage
  document.getElementById("waitingMessage").style.display = "none";
  // show countdownTimer
  document.getElementById("countdownTimer").style.display = "block";
   timer = setInterval(() => {
    setCountdown(countdown() - 1);
    document.getElementById(
      "countdownTimer"
    ).textContent = `Starting in ${countdown()} seconds...`;
    if (countdown() === 0) {
      clearInterval(timer);
      showGameGrid();
      buildGame(game.gameGrid);
    }
  }, 1000);
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
        type: "text",
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

  // Load existing messages if any
  chatMessages.forEach(msg => addChatMessage(msg));

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
  document.getElementById("chatMessages").scrollTop = document.getElementById("chatMessages").scrollHeight;
}

function sendMessage() {
  const message = document.getElementById("chatInput").value.trim();
  if (message) {
    if (ws) {
      ws.send(JSON.stringify({ message: { type: "chat", message } }));
      // addChatMessage(`You: ${message}`); // Show the sent message immediately
      document.getElementById("chatInput").value = ""; // Clear input
    }
  }
}

function loadExistingMessages() {
  //check if the same message is already loaded
  const chatMessagesList = document.getElementById("chatList");
  chatMessagesList.innerHTML = "";
  chatMessages.forEach(msg => addChatMessage(msg));
}

// Start the app with the landing page
showLandingPage();
