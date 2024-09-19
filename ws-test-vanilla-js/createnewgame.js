import { Games } from "./server.mjs";
import { buildGameObject } from "./gamebuild.js";

export function CreateNewGame() {
    const newGame = {
      clients: new Map(),
      gameGrid: buildGameObject(),
      chatMessages: [],
      players: [
        {
          playerId: randomId(),
          nickname: "",
          powerUp: "",
          beginPosition: 0,
          startPosition: 0,
          playerPosition: { x: 0, y: 0 },
          color: "White",
          lives: 0,
          keyStillDown: false,
          keyStillDownForSkate: 0,
          bombDropped: 0,
          disconnected: true,
        },
        {
          playerId: randomId(),
          nickname: "",
          powerUp: "",
          beginPosition: 0,
          startPosition: 0,
          playerPosition: { x: 0, y: 0 },
          color: "Red",
          lives: 0,
          keyStillDown: false,
          keyStillDownForSkate: 0,
          bombDropped: 0,
          disconnected: true,
        },
        {
          playerId: randomId(),
          nickname: "",
          powerUp: "",
          beginPosition: 0,
          startPosition: 0,
          playerPosition: { x: 0, y: 0 },
          color: "Blue",
          lives: 0,
          keyStillDown: false,
          keyStillDownForSkate: 0,
          bombDropped: 0,
          disconnected: true,
        },
        {
          playerId: randomId(),
          nickname: "",
          powerUp: "",
          beginPosition: 0,
          startPosition: 0,
          playerPosition: { x: 0, y: 0 },
          color: "Black",
          lives: 0,
          keyStillDown: false,
          keyStillDownForSkate: 0,
          bombDropped: 0,
          disconnected: true,
        },
      ], // To track player positions
      lockInCount: 5, // Countdown for locking in
      startingCount: 3, // Countdown for starting
      isLockingIn: false, // Game is not locking in
      isStarting: false, // Game is not starting
      isStarted: false, // Game is not started
      gameId:randomId(),
      gameTimer: 17, // To track the timer
    };

    return newGame;
  }

  function randomId() {
    return Math.floor(Math.random() * 1000000);
  }
