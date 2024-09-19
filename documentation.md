
# Bomberman Multiplayer Game - Mini Documentation

## Overview
This multiplayer Bomberman game uses native JavaScript, WebSockets, and a custom framework (`MyFramework`) to manage player movements, game state updates, and real-time chat functionality. The game is fully server-client synchronized, with player actions and events handled in real-time via WebSocket messages.

---

## Main Components

### WebSocket Communication
- **Function**: `connectToWebSocket(nickname)`
  - Establishes a WebSocket connection to the server using the provided nickname. It handles the `onopen`, `onmessage`, and `onclose` WebSocket events to maintain communication with the server.
- **Message Handling**: The server sends different types of messages, such as player movements, game state updates, chat messages, and game over notifications. The messages are processed in `handleServerMessage`, which routes them to the appropriate handler based on the `messageType`.

### Game State Management
- **State Variables**:
  - `playersReady`: Tracks the number of players ready for the game.
  - `countdown`: Manages the countdown before the game starts.
  - `ws`: Holds the WebSocket connection state.
- **Framework**: The state management is handled using `MyFramework.State`, a custom state management system.

### Player Actions
- **Movement**: Players can move using arrow keys. Their positions are updated via WebSocket messages and synced with the server using the `handlePlayerMove` function.
- **Placing Bombs**: The player can place bombs using the `sendPlaceBomb` function, which sends the bomb placement message to the server. Bombs trigger explosions that can eliminate players.
- **Game Over**: When a player dies or the game ends, the server sends a `gameOver` or `killPlayer` message, which is handled appropriately to reflect the player's status.

### Game Events
- **Countdown and Lock-in**: The game begins with a countdown timer that is controlled by the server. The client receives `lockIn` and `updateTimer` messages to update the countdown, and the game starts when the countdown reaches zero.
- **Game Over**: The game ends when there is a clear winner or all players are eliminated. The server sends a `gameOver` or `youLost` message to notify the client.

### Chat System
- **Chat Box**: A real-time chat box is available during the game. Players can send and receive messages via the WebSocket using the `sendWebSocketMessage` function with `messageType: "chat"`.
- **Message Handling**: Chat messages are stored locally in the `chatMessages` array and displayed in the game UI using the `addChatMessage` function. Previous chat messages are loaded from the server upon connection.

---

## Core Functions

### WebSocket Functions
- `connectToWebSocket(nickname)`
  - Establishes WebSocket connection and sends the player's nickname to the server.
- `sendWebSocketMessage(messageType, additionalData)`
  - Sends a WebSocket message to the server with the specified `messageType` and any additional data (e.g., direction, game events).
  
### Game Logic Functions
- `handlePlayerMove(data)`
  - Updates the player's position on the game grid based on movement data from the server.
- `moveBomberman(direction, id)`
  - Moves the player in the specified direction based on keyboard input or server messages.
- `dropBomb(player)`
  - Triggers bomb placement for the player.
  
### Chat Functions
- `handleChatMessage(data)`
  - Processes incoming chat messages and updates the chat UI.
- `showChatBox()`
  - Displays the chat box in the game interface.

### UI Functions
- `showLandingPage()`
  - Displays the initial landing page with a "Start Game" button.
- `showWaitingArea()`
  - Shows a waiting area while waiting for other players to join the game.
- `showNicknamePopup()`
  - Shows a popup where the user can enter their nickname to start the game.

---

## Message Types Handled by WebSocket
- `welcome`: Initial connection confirmation, sends number of connected players and previous chat messages.
- `lockIn`: Notifies players to lock in and start the countdown.
- `updateTimer`: Updates the countdown timer.
- `gameStarted`: Starts the game and displays the game grid.
- `updatePosition`: Updates player positions on the grid.
- `placeBomb`: Triggers bomb placement.
- `chat`: Handles chat messages sent by other players.
- `gameOver`: Ends the game for all players.
- `youLost`: Notifies the player they lost and triggers game over actions.

---

## How to Play
1. **Start the Game**: When the game loads, click the "Start Game" button and enter a nickname to join the game.
2. **Player Movement**: Use the arrow keys to move your character around the game grid.
3. **Place Bombs**: Press the bomb key to place bombs on the grid.
4. **Chat**: Use the chat box to send messages to other players.
5. **Game End**: The game ends when there is one player remaining or all players are eliminated.

---

## File Structure
```
.
├── vFw/                # Custom framework for state and DOM management
│   └── framework.js
├── structure/           # Core game logic and utilities
│   ├── buildGame.js     # Functions for setting up the game grid
│   ├── bombermanMoves.js# Player movement, bomb placement logic
│   ├── gameEvents.js    # Game event handling (e.g., player death, bomb explosion)
│   ├── model.js         # Game state model
├── images/              # Game images (e.g., logo)
└── index.html           # Main HTML file
```

---

## Future Enhancements
- Add power-ups (e.g., speed boost, bomb range extension).
- Implement a ranking system for players.
- Improve the visual representation of bombs and explosions.
