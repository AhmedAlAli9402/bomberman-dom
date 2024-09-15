import { broadcastToClients } from "./gamecounter.js";

export function startGameTimer(currentGame) {

  const timer = setInterval(() => {
    currentGame.gameTimer--;
    if (currentGame.gameTimer === 0) {
      clearInterval(timer);
      endGame();
    }
    const updateHUD = {
        messageType: "updateHUD",
        gameTimer: currentGame.gameTimer,
      };

      broadcastToClients(currentGame, updateHUD);
  }, 1000);
}