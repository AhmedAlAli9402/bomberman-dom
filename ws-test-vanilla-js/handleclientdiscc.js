export function handleClientDisconnection(ws, currentGame,Games) {
  console.log("Client disconnected",ws, currentGame,Games);
    if (currentGame.clients.has(ws)) {
      const nickname = currentGame.clients.get(ws);
      currentGame.clients.delete(ws);
      // remove player from players
      currentGame.players.pop(ws)

      // Clear the timer if it's running
      clearTimeout(currentGame.timer);

      // Broadcast the disconnection message to all clients
      const disconnectMessage = {
        messageType: "disconnect",
        nickname: nickname,
        message: `${nickname} has left the chat.`,
        clients: Array.from(currentGame.clients.values()),
        numberofClients: currentGame.clients.size,
      };
      for (const client of currentGame.clients.keys()) {
        client.send(JSON.stringify(disconnectMessage));
      }
    }

    // Remove the game if there are no players left
    if (currentGame.clients.size === 0) {
      Games.splice(Games.indexOf(currentGame), 1);
    }
  }
