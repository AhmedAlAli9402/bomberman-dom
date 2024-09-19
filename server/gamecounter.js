import { Games } from "./server.mjs";
import { startGameTimer } from "./gameTimer.js";

// Function to start the game countdown when conditions are met
export function startGameCountdown(currentGame) {
  // Ensure there are at least 2 players and the game hasn't already started or begun the countdown
  if (
    currentGame.clients.size >= 2 &&
    !currentGame.isStarting &&
    !currentGame.isStarted
  ) {
    currentGame.isLockingIn = true; // Mark the game as in the process of starting to prevent multiple countdowns

    // Prepare a message to inform players the game will start soon, allowing more players to join
    const lockInMessage = {
      messageType: "lockIn",
      message: `More players can still join, ${currentGame.lockInCount} seconds!`,
      remainingTime: currentGame.lockInCount,
    };

    // Send the lock-in message to all connected clients in the game
    broadcastToClients(currentGame, lockInMessage);

    // Start an interval to update players about the time left to join, every second
    const lockInCountInterval = setInterval(() => {
      currentGame.lockInCount--; // Decrement the countdown timer

      // Prepare an updated timer message
      const timerUpdateMessage = {
        messageType: "updateTimer",
        message: `More players can still join, ${currentGame.lockInCount} seconds!`,
        remainingTime: currentGame.lockInCount,
      };

      // Broadcast the updated timer message to all clients
      broadcastToClients(currentGame, timerUpdateMessage);

      // If the timer reaches zero or the maximum number of players (4) is reached, stop the countdown
      if (currentGame.lockInCount <= 0 || currentGame.clients.size === 4) {
        clearInterval(lockInCountInterval); // Stop the lock-in timer
        startPreGameCountdown(currentGame); // Start the pre-game countdown
      }
    }, 1000); // Update every second
  }
}

// Function to handle the final 10-second countdown before the game starts
function startPreGameCountdown(currentGame) {
  currentGame.isStarting = true; // Mark the game as starting and no longer in the lock-in phase

  // Prepare a message to inform players the game is about to start
  const lastChanceMessage = {
    messageType: "lastChance",
    message: `The game is starting in ${currentGame.startingCount} seconds!`,
    remainingTime: currentGame.startingCount,
  };

  // Notify all clients about the game starting soon
  broadcastToClients(currentGame, lastChanceMessage);

  // Start a countdown for the 10-second pre-game countdown
  const startingCountInterval = setInterval(() => {
    currentGame.startingCount--; // Decrease the pre-game countdown timer

    // Prepare an updated timer message
    const timerUpdateMessage = {
      messageType: "updateTimer",
      message: `The game is starting in ${currentGame.startingCount} seconds!`,
      remainingTime: currentGame.startingCount,
    };

    // Broadcast the updated pre-game timer message to all clients
    broadcastToClients(currentGame, timerUpdateMessage);

    // If the countdown reaches zero, the game starts
    if (currentGame.startingCount <= 0) {
      clearInterval(startingCountInterval); // Stop the pre-game countdown timer

      // Assign the gameId and mark the game as started
      currentGame.gameId = Games.length - 1;
      currentGame.isStarted = true;

      // Prepare a message to inform all clients that the game has started
      const gameStartMessage = {
        messageType: "gameStarted",
        gameId: currentGame.gameId,
        currentGame: currentGame,
      };

      // Broadcast the game start message to all clients
      broadcastToClients(currentGame, gameStartMessage);

      currentGame.isStarted = true; // Ensure the game is marked as started
    }
  }, 1000); // Update the countdown every second
}

// Function to broadcast a message to all connected clients in the game
export function broadcastToClients(currentGame, message) {
  for (const client of currentGame.clients.keys()) {
    client.send(JSON.stringify(message)); // Send the message to each connected client
  }
}

// Function to send a message to a specific client
export function sendToClient(client, message) {
  client.send(JSON.stringify(message)); // Send the message to the specified client
}
