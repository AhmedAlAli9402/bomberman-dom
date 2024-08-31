import { DOM} from '../framework/dom.js';
import {changeDirection} from './bombermanMoves.js';

export let availableSquares = []
export function buildGame() {
    let grid = document.getElementById('grid');
    for (let i=0;i<390;i++){
        grid.appendChild(DOM.createElement({ tag: 'div', attrs: { id: ('box'+i)} }));
    }
    for (let i=0;i<30;i++){
        document.getElementById('box'+i).classList.add('wall')
    }
    for (let i=0;i<360;){
        document.getElementById('box'+i).classList.add('wall')
        i+=30
    }
    for (let i=360;i<=389;i++){
        document.getElementById('box'+i).classList.add('wall')
    } 
    for (let i=62;i<=88;){
        document.getElementById('box'+i).classList.add('wall')
        i+=2
    }
    for (let i=122;i<=148;){
        document.getElementById('box'+i).classList.add('wall')
        i+=2
    }
    for (let i=182;i<=208;){
        document.getElementById('box'+i).classList.add('wall')
        i+=2
    }
    for (let i=242;i<=268;){
        document.getElementById('box'+i).classList.add('wall')
        i+=2
    }
    for (let i=302;i<=328;){
        document.getElementById('box'+i).classList.add('wall')
        i+=2
    }
    availableSquares = Array.from(document.querySelectorAll('.grid div'))
    availableSquares[31].classList.add('bombermanGoingDown');
    document.addEventListener('keydown', changeDirection)
}
