import { currentGame, updateGame } from "./server.mjs";
import { broadcastToClients } from "./gamecounter.js";

export function removeDeadPlayers(playerId) {
  if (currentGame.players[playerId]) {
    currentGame.players[playerId] = {
      ...currentGame.players[playerId],
      disconnected: true, // Mark the player as disconnected
      beginPosition: 0,
      startPosition: 0,
      playerPosition: 0, // Reset the lives
    };
  }
  updateGame(currentGame);
  let DisconnectedPlayersCount = 0;
  for (let i=0;i<currentGame.players.length;i++) {
    if (currentGame.players[i].disconnected === false) {
      DisconnectedPlayersCount++;
    }
  }
  if (DisconnectedPlayersCount === 1) {
    let message = {
      messageType: "gameOver",
      id: playerId,
    }
    broadcastToClients(currentGame, message)
  }
  return;
}

// if (players[i].lives === 0) {
//   removeDeadPlayers(i);
//   const client = Array.from(currentGame.clients.keys())[i];
//   sendToClient(client, {messageType: "youLost", id: i})
// }
