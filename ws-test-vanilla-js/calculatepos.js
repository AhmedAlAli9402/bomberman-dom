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
  } else{
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
  let moveNotPossible = player.keyStillDown
  if (player.powerUp === "skate" && player.keyStillDownForSkate < 4){
    player.keyStillDownForSkate++
    moveNotPossible = false
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
// Function to get player start positions based on game grid dimensions
export function getPlayerStartPositions(width, height, breakableWalls) {
  const possibleStartPositions = [];

  // Generate possible start positions
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const position = y * width + x;

      // Check if this position is free of walls
      if (!breakableWalls.includes(position)) {
        // Check for surrounding positions within a distance of 3
        let isValid = true;
        for (let dy = -3; dy <= 3; dy++) {
          for (let dx = -3; dx <= 3; dx++) {
            const neighborX = x + dx;
            const neighborY = y + dy;
            const neighborPosition = neighborY * width + neighborX;

            // Check bounds and if the neighbor is a breakable wall
            if (
              neighborX >= 0 &&
              neighborX < width &&
              neighborY >= 0 &&
              neighborY < height &&
              breakableWalls.includes(neighborPosition)
            ) {
              isValid = false;
              break;
            }
          }
          if (!isValid) break;
        }

        if (isValid) {
          possibleStartPositions.push(position);
        }
      }
    }
  }

  // Assign players to start positions
  return possibleStartPositions.slice(0, 4); // Assuming a maximum of 4 players
}

export function HandleExplosion(playerid, bombPosition, currentGame){
  let bombPositionIndex = positionToIndex(bombPosition, currentGame.gameGrid);
  console.log(bombPositionIndex, "bombPositionIndex");
  let bombExplosionPositions = [-1, 1, currentGame.gameGrid.width, -currentGame.gameGrid.width];

  if (currentGame.players[playerid].powerUp === "powerBomb") {
      let powerbombDirections = [-2, 2, currentGame.gameGrid.width*2, -currentGame.gameGrid.width*2];
      for (let i = 0; i < 4; i++) {
        if (!currentGame.gameGrid.wall.includes(bombPositionIndex + bombExplosionPositions[i])) {
          bombExplosionPositions.push(powerbombDirections[i]);                
        }
      }
    } 

    let bombExplosionPositionsIndex = []
    for (let i = 0; i < bombExplosionPositions.length; i++) {
      bombExplosionPositionsIndex.push(bombPositionIndex + bombExplosionPositions[i]);
    }

    console.log(currentGame.gameGrid.breakableWall, "brbrrbrrb");
    currentGame.gameGrid.breakableWall = currentGame.gameGrid.breakableWall.filter(wall => !bombExplosionPositionsIndex.includes(wall));
    console.log(currentGame.gameGrid.breakableWall, "b222rrbrrb");
  return currentGame.gameGrid.breakableWall;
  }