import { calculateNewPosition,isMoveValid } from "./calculatepos.js";

export function handleMessages(data, ws, currentGame) {
if (currentGame.clients.has(ws) && data.message) {
    const nickname = currentGame.clients.get(ws);
    const userId = Array.from(currentGame.clients.keys()).indexOf(ws);
    let broadcast = {};
    if (data.message.messageType === "move") {
      const { direction } = data.message;
      const playerId = Array.from(currentGame.clients.keys()).indexOf(ws);
      const player = currentGame.players[playerId];
      // const playerPosition = player.playerPosition;
      player.startPosition = player.playerPosition;
      // Calculate new position based on direction
      const newPosition = calculateNewPosition(player.playerPosition, direction, currentGame.gameGrid);
      player.playerPosition = newPosition;

      broadcast = {
        messageType: "updatePosition",
        id: playerId,
        currentGame: currentGame,
        direction: direction,
      };


      // Validate the move (e.g., check if the new position is free)
      /*
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
      */
    } else if (data.message.messageType === "keyUp") {
      broadcast = {
        messageType: "keyUp",
        id: userId,
      };
    } else if (data.message.messageType === "bombExplosion") {
      let singleUserMessage = {
        messageType: "bombExplosion",
        bombPosition: data.message.bombPosition,
        directions: data.message.directions,
        id: userId,
      };
      ws.send(JSON.stringify(singleUserMessage));
    } else if (data.message.messageType === "killPlayer") {
      broadcast = {
        messageType: "killPlayer",
        id: data.message.userId,
      };
    } else if (data.message.messageType === "gameover") {
      if (nickname === data.message.nickname) {
        ws.send(JSON.stringify({ messageType: "youLost" }));
      }
      // Notify others that the game is over
      const gameOverMessage = {
        messageType: "gameover",
        nickname: data.message.nickname,
      };
      currentGame.clients.forEach((client) =>
        client.send(JSON.stringify(gameOverMessage))
      );
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
