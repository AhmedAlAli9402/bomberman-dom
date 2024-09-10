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
CreateNewGame()

function CreateNewGame() {

  // let chatMessages = [];
  // Map to store clients' connection information (WebSocket connection and nickname)
  // let gameGrid = new Map();

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
    console.log(String(message), "message")
    let data;
    try {
      // Expecting JSON data from the client
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
    console.log(Games.length - 1, "Games.length-1")
    // If the client is sending their nickname on first connection
    if (data.nickname && !Games[(Games.length - 1)].clients.has(ws)) {
      // Check if the nickname is already taken and add a number to it
      if (Array.from(Games[(Games.length - 1)].clients.values()).includes(data.nickname)) {
        let i = 1;
        while (Array.from(Games[(Games.length - 1)].clients.values()).includes(data.nickname + i)) {
          i++;
        }
        data.nickname = data.nickname + i;
      }

      // Store the nickname in the map with the WebSocket connection
      Games[(Games.length - 1)].clients.set(ws, data.nickname, Games.length - 1);
      ws.nickname = data.nickname; // Store nickname in the WebSocket object for future reference
      ws.gameId = Games.length - 1;
      // Send a welcome message as JSON
      const welcomeMessage = {
        messageType: "welcome",
        nickname: data.nickname,
        message: `Welcome, ${data.nickname}!`,
        clients: Array.from(Games[(Games.length - 1)].clients.values()),
        numberofClients: Games[(Games.length - 1)].clients.size,
        gameGrid: Games[(Games.length - 1)].gameGrid,
        gameId: Games.length - 1,
        loadMessages: Games[(Games.length - 1)].chatMessages,
      };
      let length = Games.length - 1;
      console.log(String(message), "message")

      // brodcast to all clients.ws the welcome message using the map and normal for loop
      for (const client of Games[(Games.length - 1)].clients.keys()) {
        client.send(JSON.stringify(welcomeMessage));
      }

      return;
    }

    // If the client sends a regular message, broadcast it to all clients
    if (Games[data.message.gameId].clients.has(ws) && data.message) {
      const nickname = Games[data.message.gameId].clients.get(ws);
      // Get user id as the index of the client in the map
      const userId = Array.from(Games[data.message.gameId].clients.keys()).indexOf(ws);
      let broadcast = {};
      console.log("111ID", userId, nickname, data.message.type);

      if (data.message.type === "move") {
        console.log("move", nickname, data.message);
        const { direction } = data.message;
        broadcast = {
          type: "move",
          id: userId,
          direction: direction,
        };
        console.log("move-broadcast", broadcast);
      } else if (data.message.type === "keyUp") {
        console.log("keyUp", nickname, data.message);
        broadcast = {
          type: "keyUp",
          id: userId,
        };
        console.log("keyUp-broadcast", broadcast);
      } else if (data.message.type === "bombExplosion") {
        let singleUserMessage = {
          type: "bombExplosion",
          bombPosition: data.message.bombPosition,
          directions: data.message.directions,
          id: userId,
        }
        ws.send(JSON.stringify(singleUserMessage));
      } else if (data.message.type === "killPlayer") {
        broadcast = {
          type: "killPlayer",
          id: data.message.userId,
        };
        console.log("keyUp-broadcast", broadcast);
      } else if (data.message.type === 'gameover') {
        if (nickname === data.message.nickname) {
          let singleUserMessage = {
            type: 'youLost'
          }
          ws.send(JSON.stringify(singleUserMessage));
        }
      } else if (data.message.type === "chat") {
        chatMessages.push(`${nickname}: ${data.message.message}`); // Store the message
        broadcast = {
          messageType: "chat",
          nickname: nickname,
          message: data.message,
        };
      } else if (data.message.type === "newGame") {
        console.log("checkifnew")
        const userId = Array.from(Games[data.message.gameId].clients.keys()).indexOf(ws);
        if (userId === 0) {
          CreateNewGame()
        }
      }
      // Broadcast the message to all connected clients
      if (broadcast) {
        console.log(wss.clients.size, "wss.clients.size")
        for (const client of Games[data.message.gameId].clients.keys()) {
          console.log("checkifnew")
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(broadcast));
          }
        }
        // wss.clients.forEach((client) => {
        //   console.log("checking", data.message.gameId, client.gameId);
        //   if (client.gameId == data.message.gameId) {
        //     if (client.readyState === WebSocket.OPEN) {
        //       client.send(JSON.stringify(broadcast));
        //     }
        //   }
        // });

      }
      return;
    }
  });

  // Handle client disconnection
  ws.on("close", () => {
    console.log(`Client disconnected: ${ws.nickname}`);
    Games[data.message.gameId].clients.delete(ws); // Remove the client from the map on disconnect
  });

  // Handle WebSocket errors
  ws.on("error", (error) => {
    console.error(`WebSocket error for client ${ws.nickname}:`, error);
  });
});

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
  // Always keep these squares empty
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

  // Create the game grid
  let gameGrid = { allsquares: [], wall: [], breakableWall: [], powerUp: [] };
  let alreadyUsedSquare = [];

  // Create the grid squares and append to grid
  for (let i = 0; i < width * height; i++) {
    gameGrid.allsquares.push(i);
  }
  // Create external walls
  for (let i = 0; i < width; i++) {
    gameGrid.wall.push(i);
    gameGrid.wall.push(i + (height - 1) * width);
  }
  // Create external walls
  for (let i = width; i < width * height; i += width) {
    gameGrid.wall.push(i);
    gameGrid.wall.push(i + width - 1);
  }

  // Create internal walls
  for (let i = width * 2 + 2, j = 0; i < width * height; i += 2, j++) {
    gameGrid.wall.push(i);
    if (j === (width - 3) / 2) {
      i += width + 3 - 2;
      j = -1;
    }
  }
  // Create empty squares
  let emptySquares = gameGrid.allsquares.filter(
    (square) => !gameGrid.wall.includes(square)
  );

  // Remove player starting positions from empty squares and remove keepEmpty squares also
  emptySquares = emptySquares.filter(
    (square) => !playerStartPositions.includes(square)
  );
  emptySquares = emptySquares.filter((square) => !keepEmpty.includes(square));

  // Place breakable walls
  for (let i = 0; i < numberOfBreakableWalls; i++) {
    const random = getRandomIndex(emptySquares.length);
    randomSquare = emptySquares[random];
    const targetSquare = gameGrid.wall.includes(randomSquare);
    if (!targetSquare) {
      gameGrid.breakableWall.push(randomSquare);
    } else {
      i--;
    }
  }
  // Place power-ups
  for (const powerUp of powerUps) {
    for (let j = 0; j < numberOfPowerUps / powerUps.length; j++) {
      const random = getRandomIndex(emptySquares.length);
      randomSquare = emptySquares[random];
      if (
        gameGrid.breakableWall.includes(randomSquare) &&
        !alreadyUsedSquare.includes(randomSquare)
      ) {
        gameGrid.powerUp.push({ index: randomSquare, powerUp: powerUp });
        alreadyUsedSquare.push(randomSquare);
      } else {
        j--;
      }
    }
  }
  return gameGrid;
}

// Function to get a random index
function getRandomIndex(length) {
  return Math.floor(Math.random() * length);
}
