// app.js

import { MyFramework } from "./vFw/framework.js";
import { buildGame } from "./structure/buildGame.js";
// import { s } from "vite/dist/node/types.d-aGj9QkWt.js";
const container = document.getElementById("app");
const [gameStarted, setgameStarted] = MyFramework.State([]);
const [nickname, setNickname] = MyFramework.State([]);
const [playersReady, setPlayersReady] = MyFramework.State([]);

// Initialize state
// MyFramework.State({
//   gameStarted: false,
//   nickname: "",
//   playersReady: 0,
// });

// Define the landing page
function showLandingPage() {
  const landingPage = MyFramework.DOM(
    "div",
    { id: "landingPage", style: "display: flex;" },
    MyFramework.DOM("h1", { id: "title" }, "Bomberman Game"),
    MyFramework.DOM(
      "button",
      { id: "startGameButton", onclick: showNicknamePopup },
      "Start Game"
    )
  );
  if (container) {
    container.innerHTML = "";
    container.appendChild(landingPage);
  }
}

// Show the nickname popup
function showNicknamePopup() {
  const nicknameInput = MyFramework.DOM("input", {
    id: "nicknameInput",
    type: "text",
    placeholder: "Enter your nickname",
  });

  const submitButton = MyFramework.DOM(
    "button",
    { id: "submitnicknameButton", onclick: submitNickname },
    "Submit"
  );

  const nicknamePopup = MyFramework.DOM(
    "div",
    { id: "nicknamePopup", style: "display: flex;" },
    MyFramework.DOM("p", null, "Enter your nickname to start the game"),
    nicknameInput,
    submitButton
  );
  if (container) {
    container.innerHTML = "";
    container.appendChild(nicknamePopup);
  }
  document.getElementById('nicknameInput').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        submitNickname();
    }
});
}

// Submit the nickname and navigate to the waiting area
function submitNickname() {
  const nickname = document.getElementById("nicknameInput").value;
  if (nickname) {
    // setNickname(nickname);
    setPlayersReady(playersReady + 1);
    // setgameStarted(true);
    showWaitingArea();
  } else {
    alert("Please enter a nickname!");
  }
}

// Show the waiting area
function showWaitingArea() {
  const waitingMessage = MyFramework.DOM(
    "p",
    null,
    "Waiting for more players..."
  );

  const countdownTimer = MyFramework.DOM(
    "p",
    { id: "countdownTimer" },
    "Starting in 10 seconds..."
  );

  const waitingArea = MyFramework.DOM(
    "div",
    { id: "waitingArea", style: "display: flex;" },
    waitingMessage,
    countdownTimer
  );

  if (container) {
    container.innerHTML = "";
    container.appendChild(waitingArea);
  }

  MyFramework.State({
    playersReady: MyFramework.State.playersReady + 1,
  });

  if (playersReady >= 1) {
    startCountdown();
  }
}

// Start the countdown timer
function startCountdown() {
  let countdown = 1;
  const timer = setInterval(() => {
    countdown--;
    document.getElementById(
      "countdownTimer"
    ).textContent = `Starting in ${countdown} seconds...`;
    if (countdown === 0) {
      clearInterval(timer);
      showGameGrid();
      //   MyFramework.Router.navigate("game");
      buildGame();
    }
  }, 1000);
}

// Show the game grid
function showGameGrid() {
  const gameGrid = MyFramework.DOM(
    "div",
    { id: "gameGrid", style: "display: inherit;" },
    MyFramework.DOM("h1", null, "Bomberman Game"),
    MyFramework.DOM("div", { id: "grid", class: "grid" })
  );

  container.innerHTML = "";
  container.appendChild(gameGrid);
}

// Build the game on navigating to /game
// MyFramework.Router.addRoute("game", buildGame);

// Start the app with the landing page
showLandingPage();
