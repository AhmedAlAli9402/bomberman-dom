export function startGameCountdown(currentGame) {
  // If there are exactly 2 players, begin the countdown
  if (currentGame.clients.size === 2 && !currentGame.isStarting && !currentGame.isStarted) {
    let countdown1 = 20;

    const lockInMessage = {
      messageType: "lockIn",
      message: "The game is locking in 20 seconds! More players can still join.",
      remainingTime: countdown1,
    };

    // Notify all clients that the game is locking in 20 seconds
    for (const client of currentGame.clients.keys()) {
      client.send(JSON.stringify(lockInMessage));
    }
    console.log("Game is locking in 20 seconds! Waiting for more players...");

    // Start an interval to send the remaining time to clients every second
    const countdownInterval1 = setInterval(() => {
      countdown1--;
      const updateMessage = `The game is locking in ${countdown1} seconds! More players can still join.`;
      const timerUpdateMessage = {
        messageType: "updateTimer",
        message: updateMessage,
        remainingTime: countdown1,
      };

      // Notify all clients with the remaining time
      for (const client of currentGame.clients.keys()) {
        client.send(JSON.stringify(timerUpdateMessage));
      }
      
      console.log(`Time remaining: ${countdown1} seconds`);

      if (countdown1 <= 0) {
        currentGame.isStarting = true;
        clearInterval(countdownInterval1); // Stop sending timer updates when countdown reaches 0
      }
    }, 1000); // Update every second

    currentGame.timer = setTimeout(() => {
      if (currentGame.clients.size >= 2 && !currentGame.isStarting && !currentGame.isStarted) {
        let countdown2 = 10; // Reset the countdown for the last 10 seconds

        const lastChanceMessage = {
          messageType: "lastChance",
          message: "The game is starting in 10 seconds!",
          remainingTime: countdown2,
        };

        // Notify all clients that the game is starting in 10 seconds
        for (const client of currentGame.clients.keys()) {
          client.send(JSON.stringify(lastChanceMessage));
        }
        console.log("Game is starting in 10 seconds!");

        // Start an interval for the 10-second pre-game countdown
        const preGameCountdownInterval2 = setInterval(() => {
          countdown2--;
          const updateMessage = `The game is starting in ${countdown2} seconds!`;
          const timerUpdateMessage = {
            messageType: "updateTimer",
            message: updateMessage,
            remainingTime: countdown2,
          };

          // Notify all clients with the remaining time during the last 10 seconds
          for (const client of currentGame.clients.keys()) {
            client.send(JSON.stringify(timerUpdateMessage));
          }

          console.log(`Time remaining: ${countdown2} seconds`);

          if (countdown2 === 0) {
            clearInterval(preGameCountdownInterval2); // Stop sending timer updates when countdown reaches 0
          }
        }, 1000); // Update every second

        // Start the game after 10-second countdown
        setTimeout(() => {
          currentGame.isStarting = true;
          const gameStartMessage = {
            messageType: "gameStarted",
            message: "The game has now started!",
          };

          // Notify all clients that the game has started
          for (const client of currentGame.clients.keys()) {
            client.send(JSON.stringify(gameStartMessage));
          }

          console.log("Game has started!");
          currentGame.isStarted = true; // Set the flag to indicate the game has started
        }, 10000); // 10-second countdown
      }
    }, 20000); // 20-second initial countdown
  }
}
