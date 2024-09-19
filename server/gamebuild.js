// Function to build the game object, which sets up the game grid, walls, breakable walls, and power-ups
export function buildGameObject() {
  // Define the dimensions of the grid
  const height = 17;
  const width = 23;

  // Define the number of breakable walls and power-ups in the game
  const numberOfBreakableWalls = 70;
  const numberOfPowerUps = 30;

  // Available types of power-ups
  const powerUps = ["powerBomb", "extraBomb", "skate"];

  // Player starting positions (1st, 2nd, 3rd, 4th players) based on their index in the grid
  const playerStartPositions = [
    width + 1, // Top-left player start
    width * 2 - 2, // Top-right player start
    width * height - width * 2 + 1, // Bottom-left player start
    width * height - width - 2, // Bottom-right player start
  ];

  // Specific squares that must always be kept empty (used to avoid placing walls or power-ups)
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

  // Calculate and store the x and y coordinates for each player's starting position
  const playerStartCoordinates = playerStartPositions.map(position => {
    const x = position % width; // Calculate the x-coordinate (column)
    const y = Math.floor(position / width); // Calculate the y-coordinate (row)
    return { x, y }; // Return the coordinates as an object
  });

  // Initialize the game grid with necessary properties
  let gameGrid = {
    allsquares: [], // All squares in the grid
    wall: [], // Positions of the walls
    breakableWall: [], // Positions of breakable walls
    powerUp: [], // Positions and types of power-ups
    height: height, // Grid height
    width: width, // Grid width
    numberOfBreakableWalls: numberOfBreakableWalls, // Total number of breakable walls
    numberOfPowerUps: numberOfPowerUps, // Total number of power-ups
    powerUps: powerUps, // List of available power-ups
    powerUpsIndex: [], // Indices of squares containing power-ups
    playerStartPositions: playerStartCoordinates, // Player start positions using coordinates
    keepEmpty: keepEmpty, // Squares that must remain empty
  };

  let alreadyUsedSquare = []; // Keep track of squares already used for power-ups

  // Populate all squares in the grid
  for (let i = 0; i < width * height; i++) {
    gameGrid.allsquares.push(i);
  }

  // Create external walls (borders of the grid)
  for (let i = 0; i < width; i++) {
    gameGrid.wall.push(i); // Top row
    gameGrid.wall.push(i + (height - 1) * width); // Bottom row
  }

  // Create side walls (left and right edges)
  for (let i = width; i < width * height; i += width) {
    gameGrid.wall.push(i); // Left side
    gameGrid.wall.push(i + width - 1); // Right side
  }

  // Create internal walls (every second square) in a grid-like pattern
  for (let i = width * 2 + 2, j = 0; i < width * height; i += 2, j++) {
    gameGrid.wall.push(i); // Internal wall
    if (j === (width - 3) / 2) {
      // Adjust position after each row to maintain grid alignment
      i += width + 3 - 2;
      j = -1;
    }
  }

  // Get a list of all squares that are not occupied by walls
  let emptySquares = gameGrid.allsquares.filter(
    (square) => !gameGrid.wall.includes(square)
  );

  // Remove player starting positions and keepEmpty squares from the list of empty squares
  emptySquares = emptySquares.filter(
    (square) => !playerStartPositions.includes(square) && !keepEmpty.includes(square)
  );

  // Randomly place breakable walls in empty squares
  for (let i = 0; i < numberOfBreakableWalls; i++) {
    const random = getRandomIndex(emptySquares.length); // Get a random index
    let randomSquare = emptySquares[random]; // Select a random square

    // Ensure the random square is not already occupied by a wall or breakable wall
    const targetSquare = gameGrid.wall.includes(randomSquare);
    if (!targetSquare && !gameGrid.breakableWall.includes(randomSquare)) {
      gameGrid.breakableWall.push(randomSquare); // Place a breakable wall
    } else {
      i--; // Retry if the square is invalid
    }
  }

  // Randomly place power-ups inside breakable walls
  for (const powerUp of powerUps) {
    for (let j = 0; j < numberOfPowerUps / powerUps.length; j++) {
      const random = getRandomIndex(emptySquares.length); // Get a random index
      let randomSquare = emptySquares[random]; // Select a random square

      // Ensure the power-up is placed on a breakable wall and the square isn't already used
      if (
        gameGrid.breakableWall.includes(randomSquare) &&
        !alreadyUsedSquare.includes(randomSquare)
      ) {
        gameGrid.powerUp.push({ index: randomSquare, powerUp: powerUp }); // Add power-up to grid
        gameGrid.powerUpsIndex.push(randomSquare); // Track the index of the power-up
        alreadyUsedSquare.push(randomSquare); // Mark the square as used
      } else {
        j--; // Retry if the square is invalid
      }
    }
  }

  return gameGrid; // Return the completed game grid object
}

// Function to get a random index (utility function)
function getRandomIndex(length) {
  return Math.floor(Math.random() * length); // Return a random integer within the array length
}
