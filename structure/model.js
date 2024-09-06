// structure/model.js

export let height = 17;
export let width = 23;
export let numberOfBreakableWalls = 60;
export let numberOfPowerUps = 50;
export let players = [
    { nickname: "", powerUp: "", startPosition: width + 1, playerPosition:width + 1, color: "White" },
    { nickname: "", powerUp: "", startPosition: (width*2)-2, playerPosition:0 , color: "Red"},
    { nickname: "", powerUp: "", startPosition: (width*height)-(width*2)+1, playerPosition:0, color: "Blue"},
    { nickname: "", powerUp: "", startPosition: (width*height)-width-2,playerPosition:0, color: "Black"},
];
export let powerUps = ['powerBomb', 'extraBomb', 'skate'];
