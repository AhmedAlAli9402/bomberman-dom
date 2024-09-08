import { game } from './model.js';

let players = game.players;

// Format time in minutes and seconds
export function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs < 10 ? '0' : ''}${secs}s`;
  }

  // Update player name by index
export function setPlayerNickname(index, newNickname) {
  if (index >= 0 && index < players.length) {
      players[index].nickname = newNickname;
      players[index].lives = 3;
  } else {
      console.error('Invalid player index');
  }
}

// update all players names and lives by getting an array of nicknames
export function setPlayersNicknames(nicknames) {
  players.forEach((player, index) => {
    console.log('index',nicknames[index]);
    if (nicknames[index]!==undefined) {
      player.nickname = nicknames[index];
      player.lives = 3;
    }
  });
}