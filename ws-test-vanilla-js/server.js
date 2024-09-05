const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

// Create an HTTP server
const server = http.createServer();

// Create a WebSocket server and attach it to the HTTP server
const wss = new WebSocket.Server({ server });
const clients = [];

// Handle WebSocket connections
wss.on('connection', (ws) => {
    // Log a new client connection
    console.log('Client connected');
    //assigning a unique id to each client
    ws.id = ws._socket.remotePort;
    // Send a welcome message to the client
    clients.push(ws.id);
    ws.send('Welcome to the WebSocket server!');
    //create a message body with messgae text and the id of the sender
    let DM = "";
    // Handle incoming messages from the client
    ws.on('message', (message) => {
        //add to the message the id of the sender
        DM = message + ":" + ws.id;
        // Echo the message back to all clients connected to the server (including the sender)
        console.log(clients)
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(DM.toString());
            }
        });
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
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
