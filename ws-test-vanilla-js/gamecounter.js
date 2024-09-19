import { Games } from "./server.mjs";
import { startGameTimer } from "./gameTimer.js";
export function startGameCountdown(currentGame) {
  if (
    currentGame.clients.size >= 2 &&
    !currentGame.isStarting &&
    !currentGame.isStarted
  ) {
    currentGame.isLockingIn = true; // Ensure the game is marked as starting to avoid multiple countdowns

    const lockInMessage = {
      messageType: "lockIn",
      message:
        `More players can still join, ${currentGame.lockInCount} seconds!.`,
      remainingTime: currentGame.lockInCount,
    };

    // Notify all clients that the game is locking in 20 seconds
    broadcastToClients(currentGame, lockInMessage);

    // Start an interval to send the remaining time to clients every second
    const lockInCountInterval = setInterval(() => {
      currentGame.lockInCount--;
      const timerUpdateMessage = {
        messageType: "updateTimer",
        message: `More players can still join, ${currentGame.lockInCount} seconds!.`,
        remainingTime: currentGame.lockInCount,
      };

      // Notify all clients with the remaining time
      broadcastToClients(currentGame, timerUpdateMessage);

      if (currentGame.lockInCount <= 0 || currentGame.clients.size === 4) {
        clearInterval(lockInCountInterval); // Stop sending timer updates
        startPreGameCountdown(currentGame); // Start the final countdown
      }
    }, 1000); // Update every second
  }
}

function startPreGameCountdown(currentGame) {
  currentGame.isStarting = true; // Mark the game as no longer locking in
  const lastChanceMessage = {
    messageType: "lastChance",
    message: `The game is starting in ${currentGame.startingCount} seconds!`,
    remainingTime: currentGame.startingCount,
  };

  // Notify all clients that the game is starting in 10 seconds
  broadcastToClients(currentGame, lastChanceMessage);

  // Start the interval for the 10-second pre-game countdown
  const startingCountInterval = setInterval(() => {
    currentGame.startingCount--;
    const timerUpdateMessage = {
      messageType: "updateTimer",
      message: `The game is starting in ${currentGame.startingCount} seconds!`,
      remainingTime: currentGame.startingCount,
    };

    // Notify all clients with the remaining time during the last 10 seconds
    broadcastToClients(currentGame, timerUpdateMessage);

    if (currentGame.startingCount <= 0) {
      clearInterval(startingCountInterval);
      // Start the game
      currentGame.gameId = Games.length - 1;
      currentGame.isStarted = true; // Mark the game as no longer starting
      const gameStartMessage = {
        messageType: "gameStarted",
        gameId: currentGame.gameId,
        currentGame: currentGame,
      };
      broadcastToClients(currentGame, gameStartMessage);
      currentGame.isStarted = true; // Mark the game as started
    }
  }, 1000); // Update every second
}

// Function to broadcast a message to all connected clients in the game
export function broadcastToClients(currentGame, message) {
  for (const client of currentGame.clients.keys()) {
    client.send(JSON.stringify(message));
  }
}

export function sendToClient(client, message) {
  client.send(JSON.stringify(message));
}
