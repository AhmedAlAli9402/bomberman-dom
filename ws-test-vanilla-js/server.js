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
            ws.send(JSON.stringify({
                messageType: 'welcome',
                nickname: data.nickname,
                message: `Welcome, ${data.nickname}!`
            }));

            console.log(`Nickname set for client: ${data.nickname}`);
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
