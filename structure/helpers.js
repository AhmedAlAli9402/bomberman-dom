import { game } from './model.js';

const players = game.players;

// Format time in minutes and seconds
export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}m ${secs.toString().padStart(2, '0')}s`;
}

// Update player name by index
export function setPlayerNickname(index, newNickname) {
  if (index >= 0 && index < players.length) {
    const player = players[index];
    player.nickname = newNickname;
    player.lives = 3;
  } else {
    console.error('Invalid player index');
  }
}

// update all players names and lives by getting an array of nicknames
export function setPlayersNicknames(nicknames) {
  const length = Math.min(players.length, nicknames.length);
  for (let i = 0; i < length; i++) {
    const player = players[i];
    player.nickname = nicknames[i];
    player.lives = 3;
  }
}

// // Helper function to generate transform string using translateX and translateY
// export function getTransformString(x, y) {
//   return `transform: translateX(${x}px) translateY(${y}px)`;
// }
