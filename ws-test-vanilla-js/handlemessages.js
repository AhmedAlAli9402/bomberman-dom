import {
  calculateNewPosition,
  HandleExplosion,
  isMoveValid,
  positionToIndex,
} from "./calculatepos.js"

import { Games } from "./server.mjs"

let powerUpTimeOut;

export function handleMessages(data, ws) {
// find the game the player is in
  const currentGame = Games.find((game) => game.clients.has(ws))

  if (currentGame.clients.has(ws) && data.message) {
    const nickname = currentGame.clients.get(ws)
    const playerId = Array.from(currentGame.clients.keys()).indexOf(ws)
    const player = currentGame.players[playerId]
    let broadcast = {}
    if (data.message.messageType === "move") {
      const { direction } = data.message
      // const playerPosition = player.playerPosition;
      player.startPosition = player.playerPosition
      // Calculate new position based on direction
      const newPosition = calculateNewPosition(
        player.playerPosition,
        direction,
        currentGame.gameGrid
      )

      // Validate the move (e.g., check if the new position is free)
      if (isMoveValid(newPosition, currentGame, player)) {
        player.playerPosition = newPosition
        player.keyStillDown = true
        let playerIndex = positionToIndex(newPosition, currentGame.gameGrid)
        if (currentGame.gameGrid.powerUpsIndex.includes(playerIndex)) {
          if (player.powerUp !== "") {
            clearTimeout(powerUpTimeOut);
          }
          const currentPowerUp = currentGame.gameGrid.powerUp.filter((power) => power.index === playerIndex).map((power) => power.powerUp)
          if (currentPowerUp) {
          player.powerUp = currentPowerUp[0]
          }
          powerUpTimeOut = setTimeout(() => {
            player.powerUp = ""
          }, 20000)
          currentGame.gameGrid.powerUp = currentGame.gameGrid.powerUp.filter(
            (powerUp) => powerUp.index !== playerIndex
          )
          currentGame.gameGrid.powerUpsIndex =
            currentGame.gameGrid.powerUpsIndex.filter(
              (powerUp) => powerUp !== playerIndex
            )
        }
        broadcast = {
          messageType: "updatePosition",
          id: playerId,
          currentGame: currentGame,
          direction: direction,
        }
      } else {
        broadcast = {
          messageType: "invalidMove",
          id: playerId,
          currentGame: currentGame,
          direction: direction,
        }
      }
    } else if (data.message.messageType === "keyUp") {
      player.keyStillDown = false
      player.keyStillDownForSkate = 0
      broadcast = {
        messageType: "keyUp",
        id: playerId,
      }
    } else if (data.message.messageType === "placeBomb") {
      if (
        (player.bombDropped >= 1 && player.powerUp !== "extraBomb") ||
        (player.bombDropped >= 2 && player.powerUp === "extraBomb")
      )
        return
      player.bombDropped++
      broadcast = {
        messageType: "placeBomb",
        id: playerId,
        currentGame: currentGame,
      }
      const bombPosition = player.playerPosition
      setTimeout(() => {
        currentGame.gameGrid.breakableWall = HandleExplosion(
          playerId,
          bombPosition
        )
        player.bombDropped--
        broadcast = {
          messageType: "bombExplosion",
          id: playerId,
        }
      }, 3000)
    } else if (data.message.messageType === "chat") {
      currentGame.chatMessages.push(`${nickname}: ${data.message.message}`) // Store the message
      broadcast = {
        messageType: "chat",
        nickname: nickname,
        message: data.message,
      }
    } else if (data.message.messageType === "chatTest") {
      broadcast = {
        messageType: "chatTest",
        nickname: nickname,
        message: data.message,
      }
    }

    const updateGameState = {
      messageType: "updateGameState",
      currentGame: currentGame,
    }

    // Broadcast the message to all connected clients
    if (broadcast || updateGameState) {
      for (const client of currentGame.clients.keys()) {
        if (client.readyState === ws.OPEN) {
          // client.send(JSON.stringify(updateGameState));
          client.send(JSON.stringify(broadcast))
        }
      }
    }
    return
  } else {
    console.log("Invalid message received:", data, "from", ws)
  }
}
