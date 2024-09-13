export function startGameCountdown(currentGame) {
    currentGame.timer = setTimeout(() => {
      // If still 2 or more players, start the game
      if (currentGame.clients.size >= 1 && !currentGame.isStarting) {
        console.log("Game starting in 10 seconds...");
        setTimeout(() => {
          currentGame.isStarting = true; // Set isStarting to true
          console.log("Game has started!");

          // Notify all clients that the game is starting
          const startMessage = {
            messageType: "gameStarted",
            message: "The game has now started!",
          };
          for (const client of currentGame.clients.keys()) {
            client.send(JSON.stringify(startMessage));
          }
        }, 3000); // 10 seconds countdown after 20 seconds
      }
    }, 4000); // 20 seconds initial countdown
  }
