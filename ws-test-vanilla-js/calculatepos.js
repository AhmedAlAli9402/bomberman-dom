// Function to calculate the new position based on the direction
export function calculateNewPosition(currentPosition, direction, gameGrid) {
  switch (direction) {
    case "up":
      return currentPosition - gameGrid.width;
    case "down":
      return currentPosition + gameGrid.width;
    case "left":
      return currentPosition - 1;
    case "right":
      return currentPosition + 1;
    default:
      return currentPosition; // No movement
  }
}

// Function to check if the move is valid
export function isMoveValid(newPosition, currentGame) {
  const walls = currentGame.gameGrid.wall;
  const breakableWalls = currentGame.breakableWall;
  return (
    newPosition >= 0 &&
    !walls.includes(newPosition) &&
    !breakableWalls.includes(newPosition)
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
