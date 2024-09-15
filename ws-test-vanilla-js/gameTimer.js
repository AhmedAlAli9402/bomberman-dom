import { broadcastToClients } from "./gamecounter.js";

export function startGameTimer(currentGame) {
  console.log(currentGame);

  const timer = setInterval(() => {
    currentGame.gameTimer--;
    
    if (currentGame.gameTimer === 0) {
      clearInterval(timer);
      
      // Game over: Determine the winner
      let winner = null;
      let maxLives = -1;
      let tie = false;

      // Check players' lives and determine the player with the most lives
      currentGame.players.forEach((player) => {
        if (player.lives > maxLives) {
          maxLives = player.lives;
          winner = player;
          tie = false; // Reset the tie status if we have a new leader
        } else if (player.lives === maxLives) {
          tie = true; // If two players have the same number of lives, it's a tie
        }
      });

      let gameOverMessage;
      if (tie || maxLives <= 0) {
        // If it's a tie or no player has any lives, there's no winner
        gameOverMessage = {
          messageType: "gameOver",
          message: "Game over! No winner!",
        };
      } else {
        // Declare the player with the most lives as the winner
        gameOverMessage = {
          messageType: "gameOver",
          message: `Game over! The winner is ${winner.nickname} with ${winner.lives} lives!`,
        };
      }

      broadcastToClients(currentGame, gameOverMessage);
      return;
    }

    console.log(currentGame.gameTimer);

    // Update the game HUD with the remaining time
    const updateHUD = {
      messageType: "updateHUD",
      gameTimer: currentGame.gameTimer,
    };

    broadcastToClients(currentGame, updateHUD);

  }, 1000);
}
