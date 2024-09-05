// app.js

import { MyFramework } from './framework/framework.js';
import { buildGame } from './structure/buildGame.js';

// Initialize state
MyFramework.State.setState({
    gameStarted: false,
    nickname: '',
    playersReady: 0
});

// Define the landing page
function showLandingPage() {
    const startButton = MyFramework.DOM.createElement({
        tag: 'button',
        attrs: { id: 'startGameButton', onclick: showNicknamePopup },
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

// Show the nickname popup
function showNicknamePopup() {
    const nicknameInput = MyFramework.DOM.createElement({
        tag: 'input',
        attrs: { id: 'nicknameInput', type: 'text', placeholder: 'Enter your nickname' }
    });

    const submitButton = MyFramework.DOM.createElement({
        tag: 'button',
        attrs: { id: 'submitnicknameButton', onclick: submitNickname },
        children: 'Submit'
    });

    const nicknamePopup = MyFramework.DOM.createElement({
        tag: 'div',
        attrs: { id: 'nicknamePopup', style: "display: flex;" },
        children: [
            MyFramework.DOM.createElement({ tag: 'p', children: 'Enter your nickname to start the game' }),
            nicknameInput,
            submitButton
        ]
    });

    MyFramework.DOM.render(nicknamePopup, MyFramework.DOM.getById('app'));
}

// Submit the nickname and navigate to the waiting area
function submitNickname() {
    const nickname = MyFramework.DOM.getById('nicknameInput').value;
    if (nickname) {
        MyFramework.State.setState({ nickname, gameStarted: true });
        showWaitingArea();
    } else {
        alert('Please enter a nickname!');
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
