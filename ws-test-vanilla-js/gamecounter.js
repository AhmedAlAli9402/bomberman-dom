export function startGameCountdown(currentGame) {
  if (
    currentGame.clients.size >= 2 &&
    !currentGame.isStarting &&
    !currentGame.isStarted
  ) {
    currentGame.isStarting = true; // Ensure the game is marked as starting to avoid multiple countdowns
    currentGame.countdown1 = 20; // Store the countdown in the game object

    const lockInMessage = {
      messageType: "lockIn",
      message:
        "The game is locking in 20 seconds! More players can still join.",
      remainingTime: currentGame.countdown1,
    };

    // Notify all clients that the game is locking in 20 seconds
    broadcastToClients(currentGame, lockInMessage);

    // Start an interval to send the remaining time to clients every second
    const countdownInterval1 = setInterval(() => {
      currentGame.countdown1--;
      const timerUpdateMessage = {
        messageType: "updateTimer",
        message: `The game is locking in ${currentGame.countdown1} seconds! More players can still join.`,
        remainingTime: currentGame.countdown1,
      };

      // Notify all clients with the remaining time
      broadcastToClients(currentGame, timerUpdateMessage);

      if (currentGame.countdown1 <= 0) {
        clearInterval(countdownInterval1); // Stop sending timer updates
        currentGame.countdown2 = 10; // Set countdown for the last 10 seconds
        startPreGameCountdown(currentGame); // Start the final countdown
      }
    }, 1000); // Update every second
  }
}

function startPreGameCountdown(currentGame) {
  const lastChanceMessage = {
    messageType: "lastChance",
    message: "The game is starting in 10 seconds!",
    remainingTime: currentGame.countdown2,
  };

  // Notify all clients that the game is starting in 10 seconds
  broadcastToClients(currentGame, lastChanceMessage);

  // Start the interval for the 10-second pre-game countdown
  const preGameCountdownInterval2 = setInterval(() => {
    currentGame.countdown2--;
    const timerUpdateMessage = {
      messageType: "updateTimer",
      message: `The game is starting in ${currentGame.countdown2} seconds!`,
      remainingTime: currentGame.countdown2,
    };

    // Notify all clients with the remaining time during the last 10 seconds
    broadcastToClients(currentGame, timerUpdateMessage);

    if (currentGame.countdown2 <= 0) {
      clearInterval(preGameCountdownInterval2);
      // Start the game
      const gameStartMessage = {
        messageType: "gameStarted",
        message: "The game has now started!",
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
