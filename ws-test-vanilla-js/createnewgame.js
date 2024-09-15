import { Games } from "./newserver.mjs";
import { buildGameObject } from "./gamebuild.js";

export function CreateNewGame() {
    const newGame = {
      clients: new Map(),
      gameGrid: buildGameObject(),
      chatMessages: [],
      players: [
        {
          nickname: "",
          powerUp: "",
          startPosition: 0,
          playerPosition: 0,
          color: "White",
          lives: 0,
          keyStillDown: false,
          keyStillDownForSkate: 0,
          bombDropped: 0,
        },
        {
          nickname: "",
          powerUp: "",
          startPosition: 0,
          playerPosition: 0,
          color: "Red",
          lives: 0,
          keyStillDown: false,
          keyStillDownForSkate: 0,
          bombDropped: 0,
        },
        {
          nickname: "",
          powerUp: "",
          startPosition: 0,
          playerPosition: 0,
          color: "Blue",
          lives: 0,
          keyStillDown: false,
          keyStillDownForSkate: 0,
          bombDropped: 0,
        },
        {
          nickname: "",
          powerUp: "",
          startPosition: 0,
          playerPosition: 0,
          color: "Black",
          lives: 0,
          keyStillDown: false,
          keyStillDownForSkate: 0,
          bombDropped: 0,
  
        },
      ], // To track player positions
      lockInCount: 5, // Countdown for locking in
      startingCount: 3, // Countdown for starting
      isLockingIn: false, // Game is not locking in
      isStarting: false, // Game is not starting
      isStarted: false, // Game is not started
      gameId:0,
      timer: 180, // To track the timer
    };
  
    Games.push(newGame);
    return newGame;
  }