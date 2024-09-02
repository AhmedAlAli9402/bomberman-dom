import { DOM} from '../framework/dom.js';
import {changeDirection, setKeyUp} from './bombermanMoves.js';

export let players = {1:{nickname:"", powerUp:"", position:"1"}
                    , 2:{nickname:"", powerUp:"", position:"1"}
                    , 3:{nickname:"", powerUp:"", position:"1"}
                    , 4:{nickname:"", powerUp:"", position:"1"}}
let powerUps = ["speed", "bombX2", "explosionX2"]
export let availableSquares = []
export function buildGame() {
    let grid = document.getElementById('grid');
    for (let i=0;i<391;i++){
        grid.appendChild(DOM.createElement({ tag: 'div', attrs: { id: (i)} }));
    }
    for (let i=0;i<391;i++){
        document.getElementById(i).classList.add('wall')
        if (i==22){
            i+=345
        }
    }
    for (let i=23;i<391;){
        document.getElementById(i).classList.add('wall')
        i+=22
        document.getElementById(i).classList.add('wall')
        i++
    }
    for (let i=48, j= 0;i<391;){
        document.getElementById(i).classList.add('wall')
        i+=2
        j+=1
        if (j == 10) {
            i+=26
            j=0
        }
    }
    availableSquares = Array.from(document.querySelectorAll('.grid div'))
    availableSquares[24].classList.add('bombermanGoingDown');
    let emptySquares = availableSquares
    emptySquares = emptySquares.filter((square)=>!square.classList.contains("bombermanGoingDown") && !square.classList.contains("wall"))
    console.log(emptySquares.length)
    for (let i=0;i<60;i++){
       let random = Math.floor(Math.random() * (emptySquares.length-1)) + 1;
       if (!emptySquares[random].classList.contains("breakableWall")){
             emptySquares[random].classList.add('breakableWall');  
        } else {
            i--
        }
    }
    for (let i=0;i<4;i++){
        for (let j=0;j<12;j++){
            let random = Math.floor(Math.random() * (emptySquares.length-1)) + 1;
       if (emptySquares[random].classList.contains("breakableWall")){
             emptySquares[random].classList.add(powerUps[i]);  
        } else {
            j--
        }
        }
    }
    if ((emptySquares[25].classList.contains("breakableWall") && emptySquares[47].classList.contains("breakableWall")) ||
       (emptySquares[25].classList.contains("breakableWall") && emptySquares[70].classList.contains("breakableWall"))){
            emptySquares[25].classList.remove('breakableWall');
        }
    if (emptySquares[26].classList.contains("breakableWall") && emptySquares[47].classList.contains("breakableWall")){
        emptySquares[47].classList.remove('breakableWall');
    }
    document.addEventListener('keydown', changeDirection)
    document.addEventListener('keyup', setKeyUp)
}
