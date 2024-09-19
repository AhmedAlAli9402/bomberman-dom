
# Bomberman Game Grid Generator

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Grid Layout Explanation](#grid-layout-explanation)
- [Customization](#customization)
- [Functions](#functions)
  - [buildGameObject](#buildgameobject)
  - [getRandomIndex](#getrandomindex)
- [Example Output](#example-output)
- [Use Cases](#use-cases)
- [Future Improvements](#future-improvements)

## Overview

This project provides a foundational grid generator for a **Bomberman-style game**. It creates a game grid of customizable size and populates it with walls (both breakable and unbreakable), power-ups, and player starting positions. The generated grid can be used to render a Bomberman-like map for gameplay.

## Features

- **Grid Generation**: Creates a customizable game grid with specified dimensions.
- **Walls**: Generates external and internal indestructible walls.
- **Breakable Walls**: Randomly places a configurable number of breakable walls.
- **Power-ups**: Distributes power-ups within the breakable walls.
- **Player Start Positions**: Provides predefined starting positions for four players.
- **Empty Zones**: Ensures certain areas remain empty for balanced gameplay.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bomberman-grid-generator.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Import the `buildGameObject` function in your project:
   ```javascript
   import { buildGameObject } from './path-to-your-file';
   ```

## Usage

To generate a new game grid, call the `buildGameObject` function:

```javascript
const gameGrid = buildGameObject();
console.log(gameGrid);
```

This will create a game grid object with the following structure:

```json
{
  "allsquares": [0, 1, 2, ...],
  "wall": [0, 1, 22, 23, ...],
  "breakableWall": [15, 35, 48, ...],
  "powerUp": [{ "index": 35, "powerUp": "powerBomb" }, ...],
  "height": 17,
  "width": 23,
  "powerUpsIndex": [35, 48, ...],
  "playerStartPositions": [{ "x": 1, "y": 1 }, { "x": 21, "y": 1 }, ...],
  "keepEmpty": [2, 3, ...]
}
```

### Example Use Case

You can use the generated game grid to render a Bomberman-style map, placing the walls, breakable walls, and power-ups in the corresponding positions on the game board.

## Grid Layout Explanation

The game grid consists of several elements that define the game world:

1. **Walls (`wall`)**:
   - External walls surround the grid, forming boundaries.
   - Internal walls are placed in a checkerboard pattern inside the playable area.

2. **Breakable Walls (`breakableWall`)**:
   - Randomly placed within the grid.
   - Can be destroyed during gameplay to reveal hidden power-ups.

3. **Power-ups (`powerUp`)**:
   - Hidden behind breakable walls.
   - Types include `"powerBomb"`, `"extraBomb"`, and `"skate"`.

4. **Player Start Positions (`playerStartPositions`)**:
   - Four predefined positions for players to start the game.

5. **Empty Zones (`keepEmpty`)**:
   - Squares that remain empty to ensure a balanced game.

## Customization

The grid generator can be customized by modifying internal constants in the `buildGameObject` function:

- **Grid Size**: Adjust the `height` and `width` to change the number of rows and columns.
- **Number of Breakable Walls**: Modify `numberOfBreakableWalls` to set how many breakable walls are placed.
- **Number of Power-ups**: Modify `numberOfPowerUps` to set how many power-ups are distributed.
- **Power-ups Types**: Add or remove from the `powerUps` array to change the types of power-ups used.

## Functions

### `buildGameObject`

This function generates the game grid and places all elements (walls, breakable walls, power-ups, player starting positions).

#### Returns

An object containing the following:
- `allsquares`: A list of all grid squares.
- `wall`: A list of indestructible wall positions.
- `breakableWall`: A list of breakable wall positions.
- `powerUp`: A list of power-up positions and their types.
- `height`, `width`: The grid dimensions.
- `powerUpsIndex`: Positions containing power-ups.
- `playerStartPositions`: Starting positions for players.
- `keepEmpty`: Positions that should always remain empty.

#### Example Call

```javascript
const gameGrid = buildGameObject();
console.log(gameGrid);
```

### `getRandomIndex`

A utility function used to generate random indices for grid element placement.

#### Parameters
- `length`: The upper limit for generating a random number (usually the length of the available squares array).

#### Example Call

```javascript
const randomIndex = getRandomIndex(10); // Generates a random number between 0 and 9
```

## Example Output

The `buildGameObject` function returns an object representing the game grid:

```json
{
  "allsquares": [0, 1, 2, ...],
  "wall": [0, 1, 22, 23, ...],
  "breakableWall": [15, 35, 48, ...],
  "powerUp": [{ "index": 35, "powerUp": "powerBomb" }, ...],
  "height": 17,
  "width": 23,
  "powerUpsIndex": [35, 48, ...],
  "playerStartPositions": [{ "x": 1, "y": 1 }, { "x": 21, "y": 1 }, ...],
  "keepEmpty": [2, 3, ...]
}
```

## Use Cases

- **Game Setup**: Use the grid object to initialize the state of a Bomberman-style game, determining where walls, breakable walls, power-ups, and players are placed.
- **Customization**: Developers can tweak settings to create different map configurations and power-up distributions, allowing for varied gameplay experiences.

## Future Improvements

- **Dynamic Player Count**: Allow the grid generator to support flexible player counts and customizable start positions.
- **Additional Power-ups**: Introduce new power-up types and mechanics to enhance gameplay.
- **Multiple Grid Layouts**: Add the ability to generate different layouts or themed maps (e.g., forest, desert, etc.).
