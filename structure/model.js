// structure/model.js
import { MyFramework } from "../vFw/framework.js";

export const height = 17;
export const width = 23;
export const numberOfBreakableWalls = 60;
export const numberOfPowerUps = 50;
export const game = {
    gameId: 0,
    gameGrid: {},
    players: [
        { nickname: "", powerUp: "", startPosition: width + 1, playerPosition: width + 1, color: "White", lives: 0, connection: "", keyStillDown: false, keyStillDownForSkate: 0, bombDropped: 0 },
        { nickname: "", powerUp: "", startPosition: (width * 2) - 2, playerPosition: 0, color: "Red", lives: 0, connection: "", keyStillDown: false, keyStillDownForSkate: 0, bombDropped: 0 },
        { nickname: "", powerUp: "", startPosition: (width * height) - (width * 2) + 1, playerPosition: 0, color: "Blue", lives: 0, connection: "", keyStillDown: false, keyStillDownForSkate: 0, bombDropped: 0 },
        { nickname: "", powerUp: "", startPosition: (width * height) - width - 2, playerPosition: 0, color: "Black", lives: 0, connection: "", keyStillDown: false, keyStillDownForSkate: 0, bombDropped: 0 },
    ]
};

export const powerUps = Object.freeze(['powerBomb', 'extraBomb', 'skate']);

// number of players needed to start the game (minimum 2) and maximum 4
export const minimumPlayers = 2;
export const maximumPlayers = 4;

// time for the game to start
export const minimumTime = 3;
export const maximumTime = 3;

const host = 'localhost'; // change to the server IP address
export const wsUrl = `ws://${host}:8080`;

const gameDuration = 180; // 3 minutes
// const gameDuration = 1; // testing game over with 1 second
// the countdown for the timing of the game
export const [countdown, setCountdown] = MyFramework.State(gameDuration); // Countdown for the game start (3 minutes)
