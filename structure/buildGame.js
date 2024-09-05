// structure/buildGame.js

import { MyFramework } from '../vFw/framework.js';
import { changeDirection, setKeyUp } from './bombermanMoves.js';
import { height, width, players, powerUps, numberOfBreakableWalls, numberOfPowerUps } from './model.js';

export let availableSquares = [];

export function buildGame() {
    console.log('Building game...');
    const grid = document.getElementById('grid');
    // console.log(grid);
    // Create the grid squares and append to grid
    for (let i = 0; i < width * height; i++) {
        const square = MyFramework.DOM(  'div',  { id: i.toString() } );
        grid.appendChild(square);
    }

    // Create walls along the grid edges
    const createWall = (index) => document.getElementById(index).classList.add('wall');
    for (let i = 0; i < width; i++) {
        createWall(i);
        createWall(i + (height - 1) * width);
    }
    for (let i = width; i < width * height; i += width) {
        createWall(i);
        createWall(i + width - 1);
    }

    // Create internal walls
    for (let i = (width * 2) + 2, j = 0; i < width * height; i += 2, j++) {
        createWall(i);
        if (j === (width - 3) / 2) {
            i += (width + 3)-2;
            j = -1;
        }
    }

    availableSquares = Array.from(document.querySelectorAll('.grid div'));

    // Set player starting positions
    players.forEach((player) => {
        const playerSquare = availableSquares[player.position];
        playerSquare.classList.add('bomberman' + player.color + 'GoingDown');
    });
    let emptySquares = availableSquares.filter(
        (square) => !square.getAttribute('class')
    );

    // Place breakable walls
    for (let i = 0; i < numberOfBreakableWalls; i++) {
        const random = getRandomIndex(emptySquares.length);
        const targetSquare = emptySquares[random];
        if (!targetSquare.classList.contains('breakableWall')) {
            targetSquare.classList.add('breakableWall');
        } else {
            i--;
        }
    }

    // Ensure no blocked initial paths
    removeBlockedPaths(availableSquares);

    // Place power-ups
    for (const powerUp of powerUps) {
        for (let j = 0; j < numberOfPowerUps / powerUps.length; j++) {
            const random = getRandomIndex(emptySquares.length);
            const targetSquare = emptySquares[random];
            if (targetSquare.classList.contains('breakableWall') && targetSquare.classList.length < 2) {
                targetSquare.classList.add(powerUp+"PowerUp");
            } else {
                j--;
            }
        }
    }

    // Add event listeners
    document.addEventListener('keydown', changeDirection);
    document.addEventListener('keyup', setKeyUp);
}

function getRandomIndex(length) {
    return Math.floor(Math.random() * (length - 1)) + 1;
}

function removeBlockedPaths(availableSquares) {
    const pathsToCheck = [
        { idx1: width + 2, idx2: (width * 2) + 1 }, // top left corner
        { idx1: width + 2, idx2: (width * 3) + 1 },
        { idx1: width + 3, idx2: (width * 2) + 1 },
        { idx1: (width*height)-(width*2)+2, idx2: (width*height)-(width*3)+1 }, // bottom left corner
        { idx1: (width*height)-(width*2)+2, idx2: (width*height)-(width*4)+1 },
        { idx1: (width*height)-(width*4)+1, idx2: (width*height)-(width*3)+1 },
        { idx1: (width*2)-3, idx2: (width*3)-3}, // top right corner
        { idx1: (width*2)-4, idx2: (width*3)-2},
        { idx1: (width*2)-2, idx2: (width*4)-2},
        { idx1: (width*height)-width-3, idx2: (width*height)-(width*2)-2 }, // bottom right corner
        { idx1: (width*height)-width-4, idx2: (width*height)-(width*2)-2 },
        { idx1: (width*height)-width-3, idx2: (width*height)-(width*3)-2 }
    ];

    pathsToCheck.forEach(({ idx1, idx2 }) => {
        // console.log(idx1, idx2)
        if (availableSquares[idx1].classList.contains('breakableWall') && availableSquares[idx2].classList.contains('breakableWall')) {
            availableSquares[idx2].classList.remove('breakableWall');
        }
    });
}
