// ws-test-vanilla-js/server.js

const http = require("http");
const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");

// Create an HTTP server
const server = http.createServer();
// Create a WebSocket server and attach it to the HTTP server
const wss = new WebSocket.Server({ server });

let Games = [];
CreateNewGame();

function CreateNewGame() {
  Games.push({
    clients: new Map(),
    gameGrid: buildGameObject(),
    chatMessages: [],
  });
}

// Handle WebSocket connections
wss.on("connection", (ws) => {
  console.log("Client connected");
  // Handle incoming messages
  ws.on("message", (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch (e) {
      ws.send(JSON.stringify({
        messageType: "error",
        message: "Invalid data format. Expecting JSON.",
      }));
      return;
    }

    const currentGame = Games[Games.length - 1];

    if (data.nickname && !currentGame.clients.has(ws) && !data.messageType ) {
      console.log('handleNewConnection');
      handleNewConnection(ws, data, currentGame);
    } else if (Games[data.gameId].clients.has(ws)) {
      console.log('handleClientMessage');
      const TheGame = Games[data.gameId];
      // console.log("currentGame", currentGame);
      console.log("data", data);
      handleClientMessage(ws, data, TheGame);
    } else {
      console.log('Unhandled message1:', data);
    }
  });

  // Handle client disconnection
  ws.on("close", () => handleDisconnection(ws));

  // Handle WebSocket errors
  ws.on("error", (error) => {
    console.error(`WebSocket error for client ${ws.nickname}:`, error);
  });
});

function handleNewConnection(ws, data, currentGame) {
  const nickname = getUniqueNickname(data.nickname, currentGame);
  currentGame.clients.set(ws, nickname);
  ws.nickname = nickname;
  ws.gameId = Games.length - 1;

  const welcomeMessage = {
    messageType: "welcome",
    nickname: nickname,
    message: `Welcome, ${nickname}!`,
    clients: Array.from(currentGame.clients.values()),
    numberofClients: currentGame.clients.size,
    gameGrid: currentGame.gameGrid,
    gameId: Games.length - 1,
    loadMessages: currentGame.chatMessages,
  };

  broadcastToGame(currentGame, welcomeMessage);
}

function handleClientMessage(ws, data, currentGame) {
  const nickname = currentGame.clients.get(ws);
  const userId = Array.from(currentGame.clients.keys()).indexOf(ws);
  const messageHandlers = {
    move: handleMoveMessage,
    keyUp: handleKeyUpMessage,
    bombExplosion: handleBombExplosionMessage,
    killPlayer: handleKillPlayerMessage,
    gameover: handleGameOverMessage,
    chat: handleChatMessage,
    newGame: handleNewGameMessage,
  };
  console.log("data.messageType", data.messageType);
  console.log("data", data);
  const handler = messageHandlers[data.messageType];
  if (handler) {
    handler(ws, data, currentGame, nickname, userId);
  } else {
    console.log('Unhandled message2:', data);
  }
}

function handleDisconnection(ws) {
  const game = Games[ws.gameId];
  if (game && game.clients.has(ws)) {
    const nickname = game.clients.get(ws);
    game.clients.delete(ws);
    broadcastToGame(game, {
      messageType: "disconnect",
      nickname: nickname,
      message: `${nickname} has left the chat.`,
      clients: Array.from(game.clients.values()),
      numberofClients: game.clients.size,
    });
  }
}

function getUniqueNickname(nickname, game) {
  let uniqueNickname = nickname;
  let i = 1;
  while (Array.from(game.clients.values()).includes(uniqueNickname)) {
    uniqueNickname = nickname + i;
    i++;
  }
  return uniqueNickname;
}

function broadcastToGame(game, message) {
  console.log("broadcastToGame", message);
  for (const client of game.clients.keys()) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }
}

function handleMoveMessage(ws, data, game, nickname, userId) {
  console.log("handleMoveMessage", data);
  broadcastToGame(game, {
    messageType: "move",
    id: userId,
    direction: data.direction,
  });
}

function handleKeyUpMessage(ws, data, game, nickname, userId) {
  broadcastToGame(game, {
    messageType: "keyUp",
    id: userId,
  });
}

function handleBombExplosionMessage(ws, data, game, nickname, userId) {
  broadcastToGame(game, {
    messageType: "bombExplosion",
    bombPosition: data.bombPosition,
    directions: data.directions,
    id: userId,
  });
}

function handleKillPlayerMessage(ws, data, game, nickname, userId) {
  broadcastToGame(game, {
    messageType: "killPlayer",
    id: data.userId,
  });
}

function handleGameOverMessage(ws, data, game, nickname, userId) {
  if (nickname === data.nickname) {
    ws.send(JSON.stringify({ messageType: 'youLost' }));
  }
}

function handleChatMessage(ws, data, game, nickname, userId) {
  game.chatMessages.push(`${nickname}: ${data.message}`);
  broadcastToGame(game, {
    messageType: "chat",
    nickname: nickname,
    message: data.message,
  });
}

function handleNewGameMessage(ws, data, game, nickname, userId) {
  if (userId === 0) {
    CreateNewGame();
  }
}

// Serve the index.html file
const index = fs.readFileSync(path.join(__dirname, "index.html"));

// Start the HTTP server
server.listen(8080, () => {
  console.log("Server is listening on port 8080");
  server.on("request", (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(index);
  });
});

// Handle WebSocket server errors
wss.on("error", (error) => {
  console.error("WebSocket server error:", error);
});

// Function to build the game object
function buildGameObject() {
  const height = 17;
  const width = 23;
  const numberOfBreakableWalls = 100;
  const numberOfPowerUps = 50;
  const powerUps = ["powerBomb", "extraBomb", "skate"];
  const playerStartPositions = [
    width + 1,
    width * 2 - 2,
    width * height - width * 2 + 1,
    width * height - width - 2,
  ];
  const keepEmpty = [
    width + 2,
    width * 2 + 1,
    width * 2 - 3,
    width * 3 - 2,
    width * height - width * 2 + 2,
    width * height - width * 3 + 1,
    width * height - width - 3,
    width * height - width * 2 - 2,
  ];

  let gameGrid = { allsquares: [], wall: [], breakableWall: [], powerUp: [] };
  let alreadyUsedSquare = new Set();

  // Create the grid squares
  gameGrid.allsquares = Array.from({ length: width * height }, (_, i) => ({
    id: i,
    style: `transform: translateX(${(i % width) * 40}px) translateY(${Math.floor(i / width) * 40}px)`
  }));

  // Create external walls
  for (let i = 0; i < width; i++) {
    gameGrid.wall.push(i, i + (height - 1) * width);
  }
  for (let i = width; i < width * height; i += width) {
    gameGrid.wall.push(i, i + width - 1);
  }

  // Create internal walls
  for (let i = width * 2 + 2, j = 0; i < width * height; i += 2, j++) {
    gameGrid.wall.push(i);
    if (j === (width - 3) / 2) {
      i += width + 1;
      j = -1;
    }
  }

  // Create empty squares
  const wallSet = new Set(gameGrid.wall);
  const playerStartSet = new Set(playerStartPositions);
  const keepEmptySet = new Set(keepEmpty);
  let emptySquares = gameGrid.allsquares.filter(square => 
    !wallSet.has(square.id) && !playerStartSet.has(square.id) && !keepEmptySet.has(square.id)
  );

  // Place breakable walls
  for (let i = 0; i < numberOfBreakableWalls; i++) {
    const randomIndex = Math.floor(Math.random() * emptySquares.length);
    const randomSquare = emptySquares[randomIndex];
    gameGrid.breakableWall.push(randomSquare.id);
    emptySquares.splice(randomIndex, 1);
  }

  // Place power-ups
  const powerUpCount = numberOfPowerUps / powerUps.length;
  for (const powerUp of powerUps) {
    for (let j = 0; j < powerUpCount; j++) {
      const randomIndex = Math.floor(Math.random() * gameGrid.breakableWall.length);
      const randomSquare = gameGrid.breakableWall[randomIndex];
      if (!alreadyUsedSquare.has(randomSquare)) {
        gameGrid.powerUp.push({ index: randomSquare, powerUp: powerUp });
        alreadyUsedSquare.add(randomSquare);
      } else {
        j--;
      }
    }
  }

  return gameGrid;
}
