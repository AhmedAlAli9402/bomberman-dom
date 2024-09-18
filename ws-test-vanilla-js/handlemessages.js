import { calculateNewPosition, isMoveValid } from "./calculatepos.js";

export function handleMessages(data, ws, currentGame) {
  if (currentGame.clients.has(ws) && data.message) {
    const nickname = currentGame.clients.get(ws);
    const playerId = Array.from(currentGame.clients.keys()).indexOf(ws);
    const player = currentGame.players[playerId];
    let broadcast = {};

    if (data.message.messageType === "move") {
      const { direction } = data.message;
      // const playerPosition = player.playerPosition;
      player.startPosition = player.playerPosition;
      // Calculate new position based on direction
      const newPosition = calculateNewPosition(
        player.playerPosition,
        direction,
        currentGame.gameGrid
      );

      // Validate the move (e.g., check if the new position is free)
      if (isMoveValid(newPosition, currentGame)) {
        player.playerPosition = newPosition;

        broadcast = {
          messageType: "updatePosition",
          id: playerId,
          currentGame: currentGame,
          direction: direction,
        };
      } else {
        broadcast = {
          messageType: "invalidMove",
          id: playerId,
          currentGame: currentGame,
          direction: direction,
        };
      }
    } else if (data.message.messageType === "keyUp") {
      broadcast = {
        messageType: "keyUp",
        id: playerId,
      };
    } else if (data.message.messageType === "placeBomb") {
      if ((player.bombDropped >= 1 && player.powerUp !== "extraBomb") || (player.bombDropped >= 2 && player.powerUp === "extraBomb")) return;
      player.bombDropped++;

      broadcast = {
        messageType: "placeBomb",
        id: playerId,
      };
      setTimeout(() => {
        player.bombDropped--;
        broadcast = {
          messageType: "bombExplosion",
          id: playerId,
        };
      }
      , 3000);
    } else if (data.message.messageType === "killPlayer") {
      broadcast = {
        messageType: "killPlayer",
        id: data.message.userId,
      };
    } else if (data.message.messageType === "chat") {
      currentGame.chatMessages.push(`${nickname}: ${data.message.message}`); // Store the message
      broadcast = {
        messageType: "chat",
        nickname: nickname,
        message: data.message,
      };
    } else if (data.message.messageType === "chatTest") {
      broadcast = {
        messageType: "chatTest",
        nickname: nickname,
        message: data.message,
      };
    }

    const updateGameState = {
      messageType: "updateGameState",
      currentGame: currentGame,
    };

    // Broadcast the message to all connected clients
    if (broadcast || updateGameState) {
      for (const client of currentGame.clients.keys()) {
        if (client.readyState === ws.OPEN) {
          // client.send(JSON.stringify(updateGameState));
          client.send(JSON.stringify(broadcast));
        }
      }
    }
    return;
  }
}
