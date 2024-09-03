import { DOM} from '../framework/dom.js';
import {changeDirection, setKeyUp} from './bombermanMoves.js';
import { height, width, players, powerUps, numberOfBreakableWalls, numberOfPowerUps } from './model.js'

export let availableSquares = []
export function buildGame() {
    let grid = document.getElementById('grid');
    for (let i=0;i<(width*height);i++){
        grid.appendChild(DOM.createElement({ tag: 'div', attrs: { id: (i)} }));
    }
    for (let i=0;i<(width*height);i++){
        document.getElementById(i).classList.add('wall')
        if (i==width-1){
            i+=(height-2)*width
        }
    }
    for (let i=width;i<width*height;i++){
        document.getElementById(i).classList.add('wall')
        i+=width-1
        document.getElementById(i).classList.add('wall')  
    }
    for (let i=(width*2)+2, j= 0;i<width*height;i++){
        document.getElementById(i).classList.add('wall')
        i++ 
        j++
        if (j == (width-3)/2) {
            i+=(width + 3)
            j=0
        }
    }
    availableSquares = Array.from(document.querySelectorAll('.grid div'))
    availableSquares[Number(players[1].position)].classList.add('bombermanGoingDown');
    let emptySquares = availableSquares
    emptySquares = emptySquares.filter((square)=>!square.classList.contains("bombermanGoingDown") && !square.classList.contains("wall"))
    for (let i=0;i<numberOfBreakableWalls;i++){
       let random = Math.floor(Math.random() * (emptySquares.length-1)) + 1;
       if (!emptySquares[random].classList.contains("breakableWall")){
             emptySquares[random].classList.add('breakableWall');  
        } else {
            i--
        }
    }
    if ((emptySquares[width+2].classList.contains("breakableWall") && emptySquares[(width*2)+1].classList.contains("breakableWall")) ||
       (emptySquares[width+2].classList.contains("breakableWall") && emptySquares[(width*3)+1].classList.contains("breakableWall"))){
            emptySquares[width+2].classList.remove('breakableWall');
        }
    if (emptySquares[width+3].classList.contains("breakableWall") && emptySquares[(width*2)+1].classList.contains("breakableWall")){
        emptySquares[(width*2)+1].classList.remove('breakableWall');
    }
    for (let i=0;i<powerUps.length;i++){
        for (let j=0;j<(numberOfPowerUps/(powerUps.length));j++){
            let random = Math.floor(Math.random() * (emptySquares.length-1)) + 1;
            let checkSquare = emptySquares[random].classList
       if (checkSquare.contains("breakableWall") && checkSquare.length<2){
             emptySquares[random].classList.add(powerUps[i]);  
        } else {
            j--
        }
        }
    }
    document.addEventListener('keydown', changeDirection)
    document.addEventListener('keyup', setKeyUp)
}
