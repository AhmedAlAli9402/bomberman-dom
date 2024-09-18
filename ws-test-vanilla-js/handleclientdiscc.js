export function handleClientDisconnection(ws, currentGame, Games) {
  console.log("Client disconnected", ws, currentGame, Games);

  if (currentGame.clients.has(ws)) {
    const playerId = Array.from(currentGame.clients.keys()).indexOf(ws);
    const nickname = currentGame.clients.get(ws);
    currentGame.clients.delete(ws);

    // Find the playerId by matching the ws in the clients map
    console.log("playerId", playerId);
    console.log("currentGame.players[playerid]", currentGame.players[playerId]);
    // Instead of removing the player, mark their slot as disconnected
    if (currentGame.players[playerId]) {
      currentGame.players[playerId] = {
        ...currentGame.players[playerId],
        disconnected: true,  // Mark the player as disconnected
        nickname: "",        // Clear the nickname
        lives: 0,            // Reset the lives
      };
    }

    console.log("currentGame.players", currentGame.players);

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
