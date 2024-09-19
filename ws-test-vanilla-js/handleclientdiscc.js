import { removeDeadPlayers } from "./removeDeadPlayer.js";

export function handleClientDisconnection(ws, currentGame, Games) {
  console.log("Client disconnected", ws, currentGame, Games);

  if (currentGame.clients.has(ws)) {
    const playerId = Array.from(currentGame.clients.keys()).indexOf(ws);
    const nickname = currentGame.clients.get(ws);
    currentGame.clients.delete(ws);
    removeDeadPlayers(playerId);

    // Clear the timer if it's running
    clearTimeout(currentGame.timer);

    // Broadcast the disconnection message to all clients
    const disconnectMessage = {
      messageType: "disconnect",
      nickname: nickname,
      message: `${nickname} has left the game.`,
    };

    // If only one client remains, declare them the winner by default
    if (currentGame.clients.size === 1) {
      const remainingNickname = Array.from(currentGame.clients.values())[0];
      const gameOverMessage = {
        messageType: "winnerByDefault",
        currentGame: currentGame,
        nickname: remainingNickname,
      };

      for (const client of currentGame.clients.keys()) {
        client.send(JSON.stringify(gameOverMessage));
      }
    }

    // Send the disconnection message to all remaining clients
    for (const client of currentGame.clients.keys()) {
      client.send(JSON.stringify(disconnectMessage));
    }
  }

  // Remove the game if no players are left
  if (currentGame.clients.size <= 1) {
    Games.splice(Games.indexOf(currentGame), 1);
  }
}
