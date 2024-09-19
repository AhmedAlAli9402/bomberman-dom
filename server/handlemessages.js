import {
  calculateNewPosition,
  HandleExplosion,
  isMoveValid,
  positionToIndex,
} from "./calculatepos.js"

import { Games } from "./server.mjs"

let powerUpTimeOut; // To track the timeout for power-ups

// Function to handle messages received from clients
export function handleMessages(data, ws) {
  // Find the game that the player is in by checking the WebSocket client
  const currentGame = Games.find((game) => game.clients.has(ws));

  // Check if the player is in the current game and a message was received
  if (currentGame.clients.has(ws) && data.message) {
    const nickname = currentGame.clients.get(ws); // Get the player's nickname
    const playerId = Array.from(currentGame.clients.keys()).indexOf(ws); // Get the player's ID
    const player = currentGame.players[playerId]; // Access the player's data
    let broadcast = {}; // Initialize the message to be broadcasted

    // Handle "move" message
    if (data.message.messageType === "move") {
      const { direction } = data.message; // Extract direction from the message
      player.startPosition = player.playerPosition; // Save the player's current position as the start

      // Calculate the new position based on the move direction
      const newPosition = calculateNewPosition(
        player.playerPosition,
        direction,
        currentGame.gameGrid
      );

      // Check if the move is valid (e.g., the new position is free)
      if (isMoveValid(newPosition, currentGame, player)) {
        player.playerPosition = newPosition; // Update the player's position
        player.keyStillDown = true; // Indicate that the key is still pressed

        // Convert position to grid index
        let playerIndex = positionToIndex(newPosition, currentGame.gameGrid);

        // Check if the new position has a power-up
        if (currentGame.gameGrid.powerUpsIndex.includes(playerIndex)) {
          // If the player already has a power-up, clear the previous timeout
          if (player.powerUp !== "") {
            clearTimeout(powerUpTimeOut);
          }

          // Get the current power-up at the new position
          const currentPowerUp = currentGame.gameGrid.powerUp
            .filter((power) => power.index === playerIndex)
            .map((power) => power.powerUp);

          if (currentPowerUp) {
            player.powerUp = currentPowerUp[0]; // Assign the power-up to the player
          }

          // Set a timeout to clear the power-up after 20 seconds
          powerUpTimeOut = setTimeout(() => {
            player.powerUp = "";
          }, 20000);

          // Remove the power-up from the game grid
          currentGame.gameGrid.powerUp = currentGame.gameGrid.powerUp.filter(
            (powerUp) => powerUp.index !== playerIndex
          );
          currentGame.gameGrid.powerUpsIndex =
            currentGame.gameGrid.powerUpsIndex.filter(
              (powerUp) => powerUp !== playerIndex
            );
        }

        // Broadcast message to update the player's position
        broadcast = {
          messageType: "updatePosition",
          id: playerId,
          currentGame: currentGame,
          direction: direction,
        };
      } else {
        // Broadcast message for an invalid move
        broadcast = {
          messageType: "invalidMove",
          id: playerId,
          currentGame: currentGame,
          direction: direction,
        };
      }
    }

    // Handle "keyUp" message (when player releases a key)
    else if (data.message.messageType === "keyUp") {
      player.keyStillDown = false; // Mark that the key is no longer pressed
      player.keyStillDownForSkate = 0; // Reset key press time for skating
      broadcast = {
        messageType: "keyUp",
        id: playerId,
      };
    }

    // Handle "placeBomb" message
    else if (data.message.messageType === "placeBomb") {
      // Check if the player is allowed to drop more bombs (max is 1, or 2 with power-up)
      if (
        (player.bombDropped >= 1 && player.powerUp !== "extraBomb") ||
        (player.bombDropped >= 2 && player.powerUp === "extraBomb")
      ) {
        return; // If not allowed, return without placing the bomb
      }
      
      player.bombDropped++; // Increase the count of bombs dropped

      // Broadcast message that a bomb has been placed
      broadcast = {
        messageType: "placeBomb",
        id: playerId,
        currentGame: currentGame,
      };

      // Convert player's position to a grid index for the bomb
      const bombPosition = positionToIndex(player.playerPosition, currentGame.gameGrid);
      
      // Add the bomb to the game's list of bombs
      currentGame.bombs.push(bombPosition);

      // Set a timeout for the bomb to explode after 3 seconds
      setTimeout(() => {
        // Handle the explosion and update breakable walls
        currentGame.gameGrid.breakableWall = HandleExplosion(
          playerId,
          bombPosition
        );

        // Remove the bomb from the list after the explosion
        currentGame.bombs = currentGame.bombs.filter((bomb) => bomb !== bombPosition);
        player.bombDropped--; // Decrease the bomb count for the player
      }, 3000);
    }

    // Handle "chat" message (when a player sends a chat message)
    else if (data.message.messageType === "chat") {
      // Add the message to the game's chat log
      currentGame.chatMessages.push(`${nickname}: ${data.message.message}`);

      // Broadcast the chat message to all players
      broadcast = {
        messageType: "chat",
        nickname: nickname,
        message: data.message,
      };
    }

    // Handle "chatTest" message (for testing purposes)
    else if (data.message.messageType === "chatTest") {
      broadcast = {
        messageType: "chatTest",
        nickname: nickname,
        message: data.message,
      };
    }

    // Prepare an update for the game state
    const updateGameState = {
      messageType: "updateGameState",
      currentGame: currentGame,
    };

    // Broadcast the message and game state to all connected clients
    if (broadcast || updateGameState) {
      for (const client of currentGame.clients.keys()) {
        if (client.readyState === ws.OPEN) {
          // client.send(JSON.stringify(updateGameState)); // Optional game state update
          client.send(JSON.stringify(broadcast)); // Send the broadcast message
        }
      }
    }

    return; // End of function execution
  } else {
    console.log("Invalid message received:", data, "from", ws); // Log invalid messages
  }
}
