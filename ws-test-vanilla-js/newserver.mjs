// ws-test-vanilla-js/server.js
// const http = require("http");
// const WebSocket = require("ws");
import http from "http";
import { WebSocketServer } from "ws"; // Import WebSocket as Server
import { handleClientDisconnection } from "./handleclientdiscc.js";
import { buildGameObject } from "./gamebuild.js";
import { handleMessages } from "./handlemessages.js";
import { startGameCountdown } from "./gamecounter.js";
import { getPlayerStartPositions } from "./calculatepos.js";
const server = http.createServer();
const wss = new WebSocketServer({ server });

const Games = []; // Array to track all games

// Function to create a new game
function CreateNewGame() {
  const gameData = buildGameObject();

  const newGame = {
    clients: new Map(),
    gameGrid: buildGameObject(),
    chatMessages: [],
    players: [
      {
        nickname: "",
        powerUp: "",
        startPosition: 0,
        playerPosition: 0,
        color: "White",
        lives: 0,
        keyStillDown: false,
        keyStillDownForSkate: 0,
        bombDropped: 0,
      },
      {
        nickname: "",
        powerUp: "",
        startPosition: 0,
        playerPosition: 0,
        color: "Red",
        lives: 0,
        keyStillDown: false,
        keyStillDownForSkate: 0,
        bombDropped: 0,
      },
      {
        nickname: "",
        powerUp: "",
        startPosition: 0,
        playerPosition: 0,
        color: "Blue",
        lives: 0,
        keyStillDown: false,
        keyStillDownForSkate: 0,
        bombDropped: 0,
      },
      {
        nickname: "",
        powerUp: "",
        startPosition: 0,
        playerPosition: 0,
        color: "Black",
        lives: 0,
        keyStillDown: false,
        keyStillDownForSkate: 0,
        bombDropped: 0,
      },
    ], // To track player positions
    isStarting: false, // Game is not starting
    timer: null, // To track the timer
  };

  Games.push(newGame);
  return newGame;
}

// Handle WebSocket connections
wss.on("connection", (ws) => {
  console.log("Client connected");
  let data;
  let currentGame;

  // Handle incoming messages
  ws.on("message", (message) => {
    try {
      data = JSON.parse(message);
    } catch (e) {
      ws.send(
        JSON.stringify({
          messageType: "error",
          message: "Invalid data format. Expecting JSON.",
        })
      );
      return;
    }

    // If the client is sending their nickname on first connection
    if (data.nickname) {
      if (Games.length === 0 || Games[Games.length - 1].isStarting) {
        currentGame = CreateNewGame();
      } else {
        currentGame = Games[Games.length - 1];
      }

      // Check if the nickname is already taken and add a number to it
      const existingNicknames = Array.from(currentGame.clients.values());
      if (existingNicknames.includes(data.nickname)) {
        let i = 1;
        while (existingNicknames.includes(data.nickname + i)) {
          i++;
        }
        data.nickname = data.nickname + i;
      }

      // Assign the initial player position based on the current client count
      const playerId = currentGame.clients.size;
      const initialPosition =
        currentGame.gameGrid.playerStartPositions[playerId];
      currentGame.clients.set(ws, data.nickname);

      currentGame.players[playerId].nickname = data.nickname;
      currentGame.players[playerId].startPosition = initialPosition;
      currentGame.players[playerId].playerPosition = initialPosition;
      currentGame.players[playerId].lives = 3;

      // Send a welcome message
      const welcomeMessage = {
        messageType: "welcome",
        nickname: data.nickname,
        message: `Welcome, ${data.nickname}!`,
        clients: Array.from(currentGame.clients.values()),
        numberofClients: currentGame.clients.size,
        gameGrid: currentGame,
        gameId: Games.length - 1,
        loadMessages: currentGame.chatMessages,
        players: currentGame.players,
        timer: currentGame.timer,
      };
      ws.send(JSON.stringify(welcomeMessage));

      // Sync countdown for new players
      if (currentGame.isStarting && !currentGame.isStarted) {
        if (currentGame.countdown1 > 0) {
          const lockInMessage = {
            messageType: "lockIn",
            message: `The game is locking in ${currentGame.countdown1} seconds! More players can still join.`,
            remainingTime: currentGame.countdown1,
          };
          ws.send(JSON.stringify(lockInMessage));
        } else if (currentGame.countdown2 > 0) {
          const lastChanceMessage = {
            messageType: "lastChance",
            message: `The game is starting in ${currentGame.countdown2} seconds!`,
            remainingTime: currentGame.countdown2,
          };
          ws.send(JSON.stringify(lastChanceMessage));
        }
      }

      // Start the countdown timer if there are at least 2 players
      if (currentGame.clients.size === 2) {
        startGameCountdown(currentGame);
      }

      return;
    }

    // Handle regular messages
    handleMessages(data, ws, currentGame);
  });

  // Handle client disconnection
  ws.on("close", () => {
    handleClientDisconnection(ws, currentGame, Games);
  });

  // Handle WebSocket errors
  ws.on("error", (error) => {
    console.error(`WebSocket error for client ${ws.nickname}:`, error);
  });
});

// Start the HTTP server
server.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
