import { broadcastToClients } from "./gamecounter.js";
import { currentGame } from "./server.mjs";
export function startGameTimer() {
  const timer = setInterval(() => {
    currentGame.gameTimer--;

    if (currentGame.gameTimer === 0) {
      clearInterval(timer);

      // Game over: Determine the winner
      let tie = false;
      let highestLives = currentGame.players[0].lives;
      let winner = currentGame.players[0]; // Start by assuming the first player is the winner

      for (let i = 1; i < currentGame.players.length; i++) {
        let player = currentGame.players[i];
        console.log(player.lives, "player ", winner.lives, "winner");

        if (player.lives > highestLives) {
          winner = player;
          highestLives = player.lives;
          tie = false; // Reset tie if there's a new leader
        } else if (player.lives === highestLives) {
          tie = true; // If two players have the same lives, it's a tie
        }
      }

      let gameOverMessage;
      if (tie || highestLives === 0) {
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
