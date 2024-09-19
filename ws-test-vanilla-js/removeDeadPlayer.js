import { currentGame, updateGame } from "./server.mjs";

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
  return;
}
