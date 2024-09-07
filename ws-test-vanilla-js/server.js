import players from './model.js';
import { breakWall } from '../structure/gameEvents.js';
import { availableSquares } from '../structure/buildGame.js';

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
    for (let i = 0; i < players.length; i++) {
        if (players[i].connection === ""){
            players[i].connection = ws.id;
            console.log(players[i].connection)
            break
        }
    }
    ws.send('Welcome to the WebSocket server!');
    //create a message body with messgae text and the id of the sender
    let DM = "";
    // Handle incoming messages from the client
    ws.on('message', (message) => {
        switch (message.event) {
            case 'message':
        //add to the message the id of the sender
        DM = message + ":" + ws.id;
        // Echo the message back to all clients connected to the server (including the sender)
        console.log(clients)
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(DM.toString());
            }
        });
                console.log('Game started');
                break;
            case 'move':
                movePlayer(message.payload);
                break;
            case 'dropBomb':
                dropBomb(message.payload);
                break;
            default:
                console.log('Unknown event');
        }

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

function movePlayer(payload) {
    const bombermanClass = bomberman.classList[0].replace(' bomb', '');
    nextSquare.className = `bomberman${players[payload.playerId].color}Going${capitalize(payload.direction)}`;
    bomberman.classList.remove(bombermanClass);
    console.log('Player moved', payload);
}

function dropBomb(payload) {
    if (payload.powerBomb) {
        availableSquares[bombermanIndex].classList.add('powerBombDropped');
    } else {
    availableSquares[bombermanIndex].classList.add('bomb');
}
    setTimeout(() => {
        breakWall(String(bombermanIndex));
        bombDropped--;
    }, 3000);
}
