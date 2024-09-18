// Function to build the game object
export function buildGameObject() {
  const height = 17;
  const width = 23;
  const numberOfBreakableWalls = 100;
  const numberOfPowerUps = 50;
  const powerUps = ["powerBomb", "extraBomb", "skate"];
  const playerStartPositions = [
    width + 1,
    width * 2 - 2,
    width * height - width * 2 + 1,
    width * height - width - 2,
  ];

  // Always keep these squares empty
  const keepEmpty = [
    width + 2,
    width * 2 + 1,
    width * 2 - 3,
    width * 3 - 2,
    width * height - width * 2 + 2,
    width * height - width * 3 + 1,
    width * height - width - 3,
    width * height - width * 2 - 2,
  ];

  const playerStartCoordinates = playerStartPositions.map(position => {
    const x = position % width;
    const y = Math.floor(position / width);
    return { x, y };
  });

  // Create the game grid
  let gameGrid = {
    allsquares: [],
    wall: [],
    breakableWall: [],
    powerUp: [],
    height: height,
    width: width,
    numberOfBreakableWalls: numberOfBreakableWalls,
    numberOfPowerUps: numberOfPowerUps,
    powerUps: powerUps,
    powerUpsIndex: [],
    playerStartPositions: playerStartCoordinates, // Updated to use coordinates
    keepEmpty: keepEmpty,
  };
  let alreadyUsedSquare = [];

  // Create the grid squares and append to grid
  for (let i = 0; i < width * height; i++) {
    gameGrid.allsquares.push(i);
  }

  // Create external walls
  for (let i = 0; i < width; i++) {
    gameGrid.wall.push(i);
    gameGrid.wall.push(i + (height - 1) * width);
  }

  // Create internal walls
  for (let i = width; i < width * height; i += width) {
    gameGrid.wall.push(i);
    gameGrid.wall.push(i + width - 1);
  }

  // Create internal walls
  for (let i = width * 2 + 2, j = 0; i < width * height; i += 2, j++) {
    gameGrid.wall.push(i);
    if (j === (width - 3) / 2) {
      i += width + 3 - 2;
      j = -1;
    }
  }

  // Create empty squares
  let emptySquares = gameGrid.allsquares.filter(
    (square) => !gameGrid.wall.includes(square)
  );

  // Remove player starting positions from empty squares and keepEmpty squares
  emptySquares = emptySquares.filter(
    (square) => !playerStartPositions.includes(square) && !keepEmpty.includes(square)
  );

  // Place breakable walls
  for (let i = 0; i < numberOfBreakableWalls; i++) {
    const random = getRandomIndex(emptySquares.length);
    let randomSquare = emptySquares[random];
    const targetSquare = gameGrid.wall.includes(randomSquare);
    if (!targetSquare) {
      gameGrid.breakableWall.push(randomSquare);
    } else {
      i--;
    }
  }

  // Place power-ups
  for (const powerUp of powerUps) {
    for (let j = 0; j < numberOfPowerUps / powerUps.length; j++) {
      const random = getRandomIndex(emptySquares.length);
      let randomSquare = emptySquares[random];
      if (
        gameGrid.breakableWall.includes(randomSquare) &&
        !alreadyUsedSquare.includes(randomSquare)
      ) {
        gameGrid.powerUp.push({ index: randomSquare, powerUp: powerUp });
        gameGrid.powerUpsIndex.push(randomSquare);
        alreadyUsedSquare.push(randomSquare);
      } else {
        j--;
      }
    }
  }

  return gameGrid;
}

// Function to get a random index
function getRandomIndex(length) {
  return Math.floor(Math.random() * length);
}
