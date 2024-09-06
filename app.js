// app.js

import { MyFramework } from "./vFw/framework.js";
import { buildGame } from "./structure/buildGame.js";

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
    MyFramework.DOM('img',{ src: 'images/logo.png', alt: 'Bomberman' } ),
    MyFramework.DOM(
      "button",
      { id: "startGameButton", onclick: showNicknamePopup },
      "Start Game"
    ),
    MyFramework.DOM('h3',{},'A better Bomberman Game by Elites Seniors! 👴 ' ),
    MyFramework.DOM('a', {href: 'https://github.com/amali01'},'amali01'),
    MyFramework.DOM('a', {href: 'https://github.com/sahmedG'},'sahmedG'),
    MyFramework.DOM('a', {href: 'https://github.com/MSK17A'},'MSK17A'),
    MyFramework.DOM('a', {href: 'https://github.com/AhmedAlAli9402'},'AhmedAlAli9402')
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
    MyFramework.DOM('img',{ src: 'images/logo.png', alt: 'Bomberman' } ),
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
    setPlayersReady(playersReady() + 1);
    // setgameStarted(true);
    instructionsPage();
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


  if (playersReady() >= 1) {
    startCountdown();
  }
}

function instructionsPage() {
  const instructionsPage = MyFramework.DOM(
    "div",
    { id: "instructionsPage", style: "display: grid;text-align:center" },
    // MyFramework.DOM('img',{ src: 'images/logo.png', alt: 'Bomberman' } ),
    MyFramework.DOM('h1',{style:"font-size:6rem; align-items:center"},'Instructions'),
    MyFramework.DOM('h3',{},'The objective of the game is to eliminate all other players by placing bombs.'),
    MyFramework.DOM(
      "div",
      { id: "instructionsPage", style: "display: flex;text-align:center" },
      // MyFramework.DOM('img',{ src: 'images/logo.png', alt: 'Bomberman' } ),
      MyFramework.DOM('img',{ src: 'images/bomb.png', alt: 'Bomberman', style:'max-width:18px' },),

      MyFramework.DOM('p',{},'You can place a bomb using the x key.'),
    ),
    MyFramework.DOM(
      "div",
      { id: "instructionsPage", style: "display: flex;text-align:center" },
      // MyFramework.DOM('img',{ src: 'images/logo.png', alt: 'Bomberman' } ),
      MyFramework.DOM('img',{ src: 'images/arrowKeys.png', alt: 'Bomberman', style:'max-width:18px'  },),
      MyFramework.DOM('p',{},'You can move your player using the arrow keys.'),
    ),
    MyFramework.DOM(
      "div",
      { id: "instructionsPage", style: "display:flex ;text-align:center" },
      // MyFramework.DOM('img',{ src: 'images/logo.png', alt: 'Bomberman' } ),
      MyFramework.DOM('img',{ src: 'images/wall/wall.png', alt: 'Bomberman' },),
      MyFramework.DOM('p',{},'this wall cannot be broken or walked over.'),
    ),
    MyFramework.DOM(
      "div",
      { id: "instructionsPage", style: "display: flex;text-align:center" },
      // MyFramework.DOM('img',{ src: 'images/logo.png', alt: 'Bomberman' } ),
      MyFramework.DOM('img',{ src: 'images/wall/wall100.png', alt: 'Bomberman' },),
      MyFramework.DOM('p',{},'this wall can be broken by placing a bomb near it (some walls contain powerUps).'),
    ),
    MyFramework.DOM(
      "div",
      { id: "instructionsPage", style: "display: flex;text-align:center" },
      // MyFramework.DOM('img',{ src: 'images/logo.png', alt: 'Bomberman' } ),
      MyFramework.DOM('img',{ src: 'images/powerUps/speedPowerUp.png', alt: 'Bomberman' },),
      MyFramework.DOM('p',{},'the skate powerUp allows you to skate by holding down on an arrow key.'),
    ),
    MyFramework.DOM(
      "div",
      { id: "instructionsPage", style: "display: flex;text-align:center" },
      // MyFramework.DOM('img',{ src: 'images/logo.png', alt: 'Bomberman' } ),
      MyFramework.DOM('img',{ src: 'images/powerUps/PowerBombPowerUp.png', alt: 'Bomberman' },),
      MyFramework.DOM('p',{},'the powerBomb powerUp makes the bombs you drop twice as powerful.'),
    ),
    MyFramework.DOM(
      "div",
      { id: "instructionsPage", style: "display: flex;text-align:center" },
      // MyFramework.DOM('img',{ src: 'images/logo.png', alt: 'Bomberman' } ),
      MyFramework.DOM('img',{ src: 'images/powerUps/extraBombPowerUp.png', alt: 'Bomberman' },),
      MyFramework.DOM('p',{},'the extraBomb powerUp allows you to drop two bombs at the same time.'),
    ))
    const button = MyFramework.DOM(
      "button",
      { id: "go to waiting area", onclick: showWaitingArea },
      "go to waiting area"
    )
    if (container) {
      container.innerHTML = "";
      container.appendChild(instructionsPage);
      container.appendChild(button);
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
