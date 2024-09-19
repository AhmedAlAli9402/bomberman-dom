// ws-test-vanilla-js/server.js

import http from "http";
import { WebSocketServer } from "ws"; // Import WebSocket as Server
import { handleClientDisconnection } from "./handleclientdiscc.js";
import { CreateNewGame } from "./createnewgame.js";
import { handleMessages } from "./handlemessages.js";
import { startGameCountdown, broadcastToClients } from "./gamecounter.js";

const server = http.createServer();
const wss = new WebSocketServer({ server });

export const Games = []; // Array to track all games
export let currentGame;

export function updateGame(newGameData) {
  currentGame = { ...currentGame, ...newGameData };
}

// Handle WebSocket connections
wss.on("connection", (ws) => {
  console.log("Client connected");
  let data;

  console.log("Games", Games.length);

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
        Games.push(currentGame);
      } else {
        currentGame = Games[Games.length - 1];
      }
      console.log("Games2", Games.length);

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
      currentGame.players[playerId].beginPosition = initialPosition;
      currentGame.players[playerId].lives = 3;
      currentGame.players[playerId].disconnected = false;

      // Send a welcome message
      const welcomeMessage = {
        messageType: "welcome",
        nickname: data.nickname,
        message: `Welcome, ${data.nickname}!`,
        numberofClients: currentGame.clients.size,
        loadMessages: currentGame.chatMessages,
      };
      // ws.send(JSON.stringify(welcomeMessage));
      broadcastToClients(currentGame, welcomeMessage);
      // Start the countdown timer if there are at least 2 players
      if (currentGame.clients.size === 2) {
        startGameCountdown(currentGame);
      } else if (currentGame.isLockingIn) {
        const lockInMessage = {
          messageType: "lockIn",
          message: `More players can still join, ${currentGame.lockInCount} seconds!.`,
          remainingTime: currentGame.lockInCount,
        };
        ws.send(JSON.stringify(lockInMessage));
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
