import { calculateNewPosition,isMoveValid } from "./calculatepos.js";

export function handleMessages(data, ws, currentGame) {
if (currentGame.clients.has(ws) && data.message) {
    const nickname = currentGame.clients.get(ws);
    const userId = Array.from(currentGame.clients.keys()).indexOf(ws);
    let broadcast = {};
    if (data.message.messageType === "move") {
      const { direction } = data.message;
      console.log(data.message)
      // Get the current position of the player
      console.log('currentGame.players',currentGame.players);
      console.log('nickname',nickname);
      console.log('currentGame.players.get(nickname)',currentGame.players);;
      const playerPosition = currentGame.players.get(nickname);
      console.log('playerPosition',playerPosition);
      // Calculate new position based on direction
      const newPosition = calculateNewPosition(
        playerPosition,
        direction,
        currentGame.gameGrid
      );

      // Validate the move (e.g., check if the new position is free)
    //   if (isMoveValid(newPosition, currentGame)) {
        currentGame.players.set(nickname, newPosition); // Update position on server
        broadcast = {
          messageType: "move",
          id: userId,
          newPosition: newPosition,
        // };
      }
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

    // Broadcast the message to all connected clients
    if (broadcast) {
      for (const client of currentGame.clients.keys()) {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify(broadcast));
        }
      }
    }
    return;
  }
}
