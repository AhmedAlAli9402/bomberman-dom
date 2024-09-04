// app.js

import { MyFramework } from './framework/framework.js';
import { buildGame } from './structure/buildGame.js';

// Initialize state
MyFramework.State.setState({
    gameStarted: false,
    username: '',
    playersReady: 0
});

// Define the landing page
function showLandingPage() {
    const startButton = MyFramework.DOM.createElement({
        tag: 'button',
        attrs: { id: 'startGameButton', onclick: showUsernamePopup },
        children: 'Start Game'
    });

    const landingPage = MyFramework.DOM.createElement({
        tag: 'div',
        attrs: { id: 'landingPage', style: "display: flex;" },
        children: [
            MyFramework.DOM.createElement({ tag: 'h1', children: 'Bomberman Game' }),
            startButton
        ]
    });

    MyFramework.DOM.render(landingPage, MyFramework.DOM.getById('app'));
}

// Show the username popup
function showUsernamePopup() {
    const usernameInput = MyFramework.DOM.createElement({
        tag: 'input',
        attrs: { id: 'usernameInput', type: 'text', placeholder: 'Enter your username' }
    });

    const submitButton = MyFramework.DOM.createElement({
        tag: 'button',
        attrs: { id: 'submitUsernameButton', onclick: submitUsername },
        children: 'Submit'
    });

    const usernamePopup = MyFramework.DOM.createElement({
        tag: 'div',
        attrs: { id: 'usernamePopup', style: "display: flex;" },
        children: [
            MyFramework.DOM.createElement({ tag: 'p', children: 'Enter your username to start the game' }),
            usernameInput,
            submitButton
        ]
    });

    MyFramework.DOM.render(usernamePopup, MyFramework.DOM.getById('app'));
}

// Submit the username and navigate to the waiting area
function submitUsername() {
    const username = MyFramework.DOM.getById('usernameInput').value;
    if (username) {
        MyFramework.State.setState({ username, gameStarted: true });
        showWaitingArea();
    } else {
        alert('Please enter a username!');
    }
}

// Show the waiting area
function showWaitingArea() {
    const waitingMessage = MyFramework.DOM.createElement({
        tag: 'p',
        children: 'Waiting for more players...'
    });

    const countdownTimer = MyFramework.DOM.createElement({
        tag: 'p',
        attrs: { id: 'countdownTimer' },
        children: 'Starting in 10 seconds...'
    });

    const waitingArea = MyFramework.DOM.createElement({
        tag: 'div',
        attrs: { id: 'waitingArea', style: "display: flex;" },
        children: [waitingMessage, countdownTimer]
    });

    MyFramework.DOM.render(waitingArea, MyFramework.DOM.getById('app'));

    MyFramework.State.setState({
        playersReady: MyFramework.State.getState().playersReady + 1
    });

    if (MyFramework.State.getState().playersReady >= 1) {
        startCountdown();
    }
}

// Start the countdown timer
function startCountdown() {
    let countdown = 1;
    const timer = setInterval(() => {
        countdown--;
        MyFramework.DOM.getById('countdownTimer').textContent = `Starting in ${countdown} seconds...`;
        if (countdown === 0) {
            clearInterval(timer);
            showGameGrid();
            MyFramework.Router.navigate('game');
        }
    }, 1000);
}

// Show the game grid
function showGameGrid() {
    const gameGrid = MyFramework.DOM.createElement({
        tag: 'div',
        attrs: { id: 'gameGrid', style: "display: inherit;" },
        children: [
            MyFramework.DOM.createElement({ tag: 'h1', children: 'Bomberman Game' }),
            MyFramework.DOM.createElement({ tag: 'div', attrs: { id: 'grid' ,class:'grid' }  })
        ]
    });

    MyFramework.DOM.render(gameGrid, MyFramework.DOM.getById('app'));
}

// Build the game on navigating to /game
MyFramework.Router.addRoute('game', buildGame);

// Start the app with the landing page
showLandingPage();
