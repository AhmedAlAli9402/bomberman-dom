// structure/model.js

export let height = 17;
export let width = 23;
export let numberOfBreakableWalls = 60;
export let numberOfPowerUps = 36;
export let players = [
    { nickname: "", powerUp: "", position: width + 1, color: "White" },
    { nickname: "", powerUp: "", position: (width*2)-2 , color: "Red"},
    { nickname: "", powerUp: "", position: (width*height)-(width*2)+1, color: "Blue"},
    { nickname: "", powerUp: "", position: (width*height)-width-2, color: "Black"},
];
export let powerUps = ['extraFlame', 'extraBomb', 'skate'];
