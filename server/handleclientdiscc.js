import { removeDeadPlayers } from "./removeDeadPlayer.js";

export function handleClientDisconnection(ws, currentGame, Games) {
  if (currentGame.clients.has(ws)) {
    const playerId = Array.from(currentGame.clients.keys()).indexOf(ws);
    const nickname = currentGame.clients.get(ws);

    // Remove player from the game and clear dead player data
    currentGame.clients.delete(ws);
    removeDeadPlayers(playerId);

    // Broadcast disconnection message to remaining clients
    const disconnectMessage = {
      messageType: "disconnect",
      nickname: nickname,
      message: `${nickname} has left the game.`,
    };

    // Clear the game timer if it was running
    clearTimeout(currentGame.timer);

    // If only one client is left, declare them the winner
    if (currentGame.clients.size === 1) {
      const remainingNickname = Array.from(currentGame.clients.values())[0];
      const gameOverMessage = {
        messageType: "winnerByDefault",
        currentGame: currentGame,
        nickname: remainingNickname,
      };

      // Notify the remaining client of their victory
      for (const client of currentGame.clients.keys()) {
        client.send(JSON.stringify(gameOverMessage));
      }

      // Optionally: Reset the game state here after declaring the winner
      resetGame(currentGame);
    }

    // Broadcast the disconnection message to all remaining clients
    for (const client of currentGame.clients.keys()) {
      client.send(JSON.stringify(disconnectMessage));
    }
  }

  // Remove the game if no players are left
  if (currentGame.clients.size === 0) {
    Games.splice(Games.indexOf(currentGame), 1); // Remove game from list
    resetGame(currentGame); // Clear the game state after it ends
  }
}

// Helper function to reset the game state
function resetGame(game) {
  game.clients.clear();  // Clear all client connections
  game.players = [];      // Reset player data
  game.isStarting = false; // Reset starting flag
  game.isFinished = true;  // Mark game as finished
}
