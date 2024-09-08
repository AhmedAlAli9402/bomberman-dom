const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
// Create an HTTP server
const server = http.createServer();

// Create a WebSocket server and attach it to the HTTP server
const wss = new WebSocket.Server({ server });
// Map to store clients' connection information (WebSocket connection and nickname)
let clients = new Map();
let gameGrid = new Map();

gameGrid = buildGameObject();
console.log(gameGrid);
// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('Client connected');
    // Handle incoming messages
    ws.on('message', (message) => {
        let data;
        try {
            // Expecting JSON data from the client
            data = JSON.parse(message);
        } catch (e) {
            ws.send(JSON.stringify({ messageType: 'error', message: 'Invalid data format. Expecting JSON.' }));
            return;
        }

        // If the client is sending their nickname on first connection
        if (data.nickname && !clients.has(ws)) {
            // Store the nickname in the map with the WebSocket connection
            clients.set(ws, data.nickname);
            ws.nickname = data.nickname; // Store nickname in the WebSocket object for future reference


            // Send a welcome message as JSON
            const welcomeMessage = {
                messageType: 'welcome',
                nickname: data.nickname,
                message: `Welcome, ${data.nickname}!`,
                clients: Array.from(clients.values()),
                numberofClients: wss.clients.size,
                gameGrid: gameGrid
            };
            for (let client of wss.clients) {
                client.send(JSON.stringify(welcomeMessage));
            }
            return;
        }

        // If the client sends a regular message, broadcast it to all clients
        if (clients.has(ws) && data.message) {
            const nickname = clients.get(ws);
            const chatMessage = {
                messageType: 'chat',
                nickname: nickname,
                message: data.message
            };

            // Broadcast the message to all connected clients
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(chatMessage));
                }
            });
        }
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log(`Client disconnected: ${ws.nickname}`);
        clients.delete(ws); // Remove the client from the map on disconnect
    });
});

const index = fs.readFileSync(path.join(__dirname, 'index.html'));

// Start the HTTP server
server.listen(8080, () => {
    console.log('Server is listening on port 8080');
    server.on('request', (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(index);
    });
});

function buildGameObject(){
    let height = 17;
    let width = 23;
    let numberOfBreakableWalls = 60;
    let numberOfPowerUps = 50;
    let powerUps = ['powerBomb', 'extraBomb', 'skate'];
    let gameGrid = {allsquares:[], wall:[], breakableWall:[], powerUp:[]};
    // console.log(grid);
    // Create the grid squares and append to grid
    for (let i = 0; i < width * height; i++) {
        gameGrid.allsquares.push(i)
    }
    for (let i = 0; i < width; i++) {
        gameGrid.wall.push(i);
        gameGrid.wall.push(i + (height - 1) * width);
    }
    for (let i = width; i < width * height; i += width) {
        gameGrid.wall.push(i);
        gameGrid.wall.push(i + width - 1);
    }

    // Create internal walls
    for (let i = (width * 2) + 2, j = 0; i < width * height; i += 2, j++) {
        gameGrid.wall.push(i);
        if (j === (width - 3) / 2) {
            i += (width + 3)-2;
            j = -1;
        }
    }
    let emptySquares = gameGrid.allsquares.filter(
        (square) => !gameGrid.wall.includes(square)
    );
    // Place breakable walls
    for (let i = 0; i < numberOfBreakableWalls; i++) {
        const random = getRandomIndex(emptySquares[emptySquares.length-1]);
        const targetSquare = gameGrid.wall.includes(random)
        if (!targetSquare) {
            gameGrid.breakableWall.push(random);
        } else {
            i--;
        }
    }
    // Place power-ups
    for (const powerUp of powerUps) {
        for (let j = 0; j < numberOfPowerUps / powerUps.length; j++) {
            const random = getRandomIndex(emptySquares.length);
            const targetSquare = emptySquares[random];
            if (gameGrid.breakableWall.includes(random)) {
                gameGrid.powerUp.push({"index":random, "powerUp":powerUp});
            } else {
                j--;
            }
        }
    }
    return gameGrid;
}

function getRandomIndex(length) {
    return Math.floor(Math.random() * (length - 1)) + 1;
}
