import { broadcastToClients,sendToClient } from "./gamecounter.js";
import { currentGame, updateGame } from "./server.mjs";
import { removeDeadPlayers } from "./removeDeadPlayer.js";

// Function to calculate the new position based on the direction
export function calculateNewPosition(currentPosition, direction, gameGrid) {
  let newX = currentPosition.x;
  let newY = currentPosition.y;
  if (newX && newY) {
    switch (direction) {
      case "ArrowUp":
        newY = Math.max(0, newY - 1); // Prevent moving out of bounds
        break;
      case "ArrowDown":
        newY = Math.min(gameGrid.height - 1, newY + 1); // Prevent moving out of bounds
        break;
      case "ArrowLeft":
        newX = Math.max(0, newX - 1); // Prevent moving out of bounds
        break;
      case "ArrowRight":
        newX = Math.min(gameGrid.width - 1, newX + 1); // Prevent moving out of bounds
        break;
      default:
        return currentPosition; // No movement
    }
  } else {
    console.log("No x and y");
  }
  return { x: newX, y: newY }; // Return the new position
}

// Function to convert x, y to a single position index
export function positionToIndex(position, gameGrid) {
  return position.y * gameGrid.width + position.x;
}

// Function to check if the move is valid
export function isMoveValid(newPosition, currentGame, player) {
  const walls = currentGame.gameGrid.wall;
  const breakableWalls = currentGame.gameGrid.breakableWall;
  let moveNotPossible = player.keyStillDown;
  if (player.powerUp === "skate" && player.keyStillDownForSkate < 4) {
    player.keyStillDownForSkate++;
    moveNotPossible = false;
  }
  // Convert new position to index
  const newIndex = positionToIndex(newPosition, currentGame.gameGrid);
  return (
    newIndex >= 0 &&
    !walls.includes(newIndex) &&
    !breakableWalls.includes(newIndex) &&
    !moveNotPossible
  );
}

export function HandleExplosion(playerid, bombPosition) {
  let bombPositionIndex = positionToIndex(bombPosition, currentGame.gameGrid);
  let bombExplosionPositions = [
    -1,
    1,
    currentGame.gameGrid.width,
    -currentGame.gameGrid.width,
  ];

  if (currentGame.players[playerid].powerUp === "powerBomb") {
    let powerbombDirections = [
      -2,
      2,
      currentGame.gameGrid.width * 2,
      -currentGame.gameGrid.width * 2,
    ];
    for (let i = 0; i < 4; i++) {
      if (
        !currentGame.gameGrid.wall.includes(
          bombPositionIndex + bombExplosionPositions[i]
        )
      ) {
        bombExplosionPositions.push(powerbombDirections[i]);
      }
    }
  }
  let bombExplosionPositionsIndex = [];
  for (let i = 0; i < bombExplosionPositions.length; i++) {
    bombExplosionPositionsIndex.push(
      bombPositionIndex + bombExplosionPositions[i]
    );
  }
  
  currentGame.gameGrid.breakableWall =
  currentGame.gameGrid.breakableWall.filter(
    (wall) => !bombExplosionPositionsIndex.includes(wall)
  );
  checkIfPlayersInBlastRadius(
    bombPositionIndex,
    bombExplosionPositionsIndex,
    currentGame
  );
  return currentGame.gameGrid.breakableWall;
}

export function checkIfPlayersInBlastRadius(
  bombPosition,
  bombExplosionPositions,
  currentGame
) {
  const players = currentGame.players;
  let playersStartPositions = players.map((player) => player.beginPosition);
  let playersStartPositionsIndex = players.map((player) => positionToIndex(player.beginPosition, currentGame.gameGrid));
  let playersPositionsIndex = players.map((player) => positionToIndex(player.playerPosition, currentGame.gameGrid));
  for (let i = 0; i < playersStartPositionsIndex.length; i++) {
    if (playersPositionsIndex.includes(playersStartPositions[i])) {
      playersStartPositions[i] = "";
    }
  }
  for (let i=0;i<players.length;i++) {
  if (players[i].disconnected) {
    continue;
  }
  let playerKilled = false;
  for (let k=0;k<bombExplosionPositions.length;k++) {
    if (bombExplosionPositions[k] === playersPositionsIndex[i]) {
      playerKilled = true;
      let message = {
        messageType: "killPlayer",
        id: i,

      }
      broadcastToClients(currentGame, message)
      players[i].lives--;
    }
  }
  if (bombPosition === playersPositionsIndex[i]) {
    playerKilled = true;
    let message = {
      messageType: "killPlayer",
      id: i,
    }
    broadcastToClients(currentGame, message); 
    players[i].lives--;
  }
     if (playerKilled && players[i].lives !== 0) {
    if(playersStartPositionsIndex[i] !== "") {
      players[i].playerPosition =playersStartPositions[i]
    } else {
      for (let j =0;j<playerStartPositions.length;j++) {
        players[i].playerPosition ={x:playerStartPositions[i] % currentGame.gameGrid.width,
          y:Math.floor(playerStartPositions[i] / currentGame.gameGrid.width)}
          console.log("reset position", players[i].playerPosition);
          break;}
        }
        }
      let message = {
        messageType: "updatePosition",
        id: i,
        currentGame: currentGame,
        direction: "reset",
        newPosition: positionToIndex(
          players[i].playerPosition,
          currentGame.gameGrid
        ),
      };
      broadcastToClients(currentGame, message);
      if (players[i].lives === 0) {
        removeDeadPlayers(i);
        const client = Array.from(currentGame.clients.keys())[i];
        sendToClient(client, {messageType: "youLost", id: i})
      }
    }
      updateGame(currentGame);
  }
