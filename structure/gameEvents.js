import { availableSquares } from './buildGame.js'; // Import the available squares in the game grid
import { width, game } from './model.js'; // Import the game state and grid width
import { updateHUD } from './buildGame.js'; // Import function to update the HUD display

let players = game.players; // Store reference to all players from the game state

// Function to find the explosion directions for a bomb based on its position
export function findExplosionDirections(id) {
    let bomb = document.getElementById(id); // Get the bomb element by ID
    let powerbomb = false; // Flag to check if it's a powerbomb

    // If the bomb is not found, check for a powerbomb class
    if (!bomb.classList.contains('bomb')) {
        bomb = document.querySelector('.powerBombDropped'); // Find the powerbomb
        powerbomb = true;
    }
    
    if (!bomb) return; // Exit if no bomb is found
    const bombPosition = Number(bomb.getAttribute('id')); // Get the bomb's position
    let directions = [-1, 1, width, -width]; // Default explosion directions (left, right, down, up)
    
    // If it's a powerbomb, add extended explosion directions
    if (powerbomb) {
        let powerbombDirections = [-2, 2, width * 2, -width * 2]; // Double range directions
        for (let i = 0; i < 4; i++) {
            // Ensure powerbomb directions do not pass through walls
            if (!availableSquares[bombPosition + directions[i]].classList.contains('wall')) {
                directions.push(powerbombDirections[i]); // Add extra range if no wall blocks it
            }
        }
    }
    return directions; // Return the valid explosion directions
}

// Function to break walls or show explosions in the calculated directions
export function breakWall(id, directions) {
    let bomb = document.getElementById(id); // Get the bomb element by ID
    const bombPosition = Number(bomb.getAttribute('id')); // Get the bomb's position
    
    for (let i = 0; i < directions.length; i++) {
        const square = availableSquares[bombPosition + directions[i]]; // Get the target square in the explosion direction
        
        // If the square contains a breakable wall, replace it with an explosion effect
        if (square && square.classList.contains('breakableWall')) {
            square.classList.replace('breakableWall', 'breakWall'); // Change the class
            // Update the game state to remove the broken wall
            game.gameGrid.breakableWall = game.gameGrid.breakableWall.filter(wall => wall !== bombPosition + directions[i]);
            setTimeout(() => square.classList.remove('breakWall'), 500); // Remove explosion effect after 500ms
        } else if (square && !square.classList.length) {
            // If the square is empty, just show the explosion effect
            square.classList.add("sideExplosion");
            setTimeout(() => square.classList.remove("sideExplosion"), 200); // Remove explosion effect after 200ms
        }
    }
    
    // Change the bomb element to explosion
    bomb.classList.replace("bomb", 'explosion');
    if (bomb.classList.contains('powerBombDropped')) {
        bomb.classList.replace('powerBombDropped', 'explosion'); // Handle powerbomb as well
    }
    setTimeout(() => bomb.classList.remove('explosion'), 200); // Remove the explosion after 200ms
}

// Function to handle killing a player when hit by an explosion
export function killPlayer(userId) {
    const bomberman = document.querySelector(`.bomberman${players[userId].color}GoingUp, .bomberman${players[userId].color}GoingRight, .bomberman${players[userId].color}GoingDown, .bomberman${players[userId].color}GoingLeft`);
    bomberman.classList.add('dead'); // Mark the player as dead by adding 'dead' class
    setTimeout(() => {
        bomberman.removeAttribute('class'); // Remove player from the grid after a short delay
    }, 50);
    updateHUD(userId); // Update the HUD to reflect the player's death
}

// Function to synchronize the game grid structure with the game state
export function checkGameStructure(gameGrid) {
    // Check if any breakable walls have been destroyed or created
    if (gameGrid.breakableWall.length < game.gameGrid.breakableWall.length) {
        // Remove walls that no longer exist in the game state
        game.gameGrid.breakableWall.map(wall => {
            if (!gameGrid.breakableWall.includes(wall)) {
                document.getElementById(wall).classList.remove('breakableWall');
            }
        });
        game.gameGrid.breakableWall = gameGrid.breakableWall; // Sync the state
    } else if (gameGrid.breakableWall.length > game.gameGrid.breakableWall.length) {
        // Add any new breakable walls that appear in the game grid
        gameGrid.breakableWall.map(wall => {
            if (!game.gameGrid.breakableWall.includes(wall)) {
                document.getElementById(wall).classList.add('breakableWall');
            }
        });
    }

    // Check and update the power-ups on the game grid
    if (gameGrid.powerUps.length < game.gameGrid.powerUps.length) {
        // Remove power-ups that no longer exist in the game state
        game.gameGrid.powerUps.map(powerUp => {
            if (!gameGrid.powerUps.includes(powerUp)) {
                document.getElementById(powerUp.index).classList.remove(powerUp.powerUp);
            }
        });
        game.gameGrid.powerUps = gameGrid.powerUps; // Sync the state
    }
}
