import { currentGame, updateGame } from "./server.mjs";
import { broadcastToClients } from "./gamecounter.js";

// Function to remove or mark players as disconnected
export function removeDeadPlayers(playerId) {
  
  // Check if the player exists in the current game
  if (currentGame.players[playerId]) {
    
    // Update the player's status to mark them as disconnected
    currentGame.players[playerId] = {
      ...currentGame.players[playerId], // Spread the existing player properties
      disconnected: true, // Mark the player as disconnected
      beginPosition: 0,    // Reset their beginning position
      startPosition: 0,    // Reset their start position
      playerPosition: 0,   // Reset their position or lives
    };
  }

  // Update the current game state with the modified players
  updateGame(currentGame);

  // Variable to keep track of how many players are still connected
  let DisconnectedPlayersCount = 0;
  
  // Loop through all players to count the ones that are still connected
  for (let i = 0; i < currentGame.players.length; i++) {
    if (currentGame.players[i].disconnected === false) {
      DisconnectedPlayersCount++;
    }
  }

  // If only one player is still connected, declare the game over
  if (DisconnectedPlayersCount === 1) {
    
    // Prepare a message to be broadcasted to clients indicating the game is over
    let message = {
      messageType: "gameOver",  // Type of message
      id: playerId,             // ID of the last player
    };

    // Broadcast the game over message to all clients
    broadcastToClients(currentGame, message);
  }

  return; // Exit the function
}
