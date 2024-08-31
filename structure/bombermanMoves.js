import {availableSquares} from './buildGame.js'


export function changeDirection(e){
    switch(e.key){
        case 'ArrowUp':
            moveBomberman("up")
            break
        case 'ArrowRight':
            moveBomberman("right")
            break
        case 'ArrowDown':
            moveBomberman("down")
            break
        case 'ArrowLeft':
                moveBomberman("left")
                break
            }
    }
    
function moveBomberman(direction){
    let bomberman = document.querySelector('.bombermanGoingUp')
     || document.querySelector('.bombermanGoingRight')
      || document.querySelector('.bombermanGoingDown')
       || document.querySelector('.bombermanGoingLeft') 
    let bombermanIndex = availableSquares.indexOf(bomberman)
    switch(direction){
        case 'up':
            if(bombermanIndex-30 >=0 && !availableSquares[bombermanIndex-30].classList.contains('wall')){
                availableSquares[bombermanIndex - 30].classList.add('bombermanGoingUp')
                availableSquares[bombermanIndex].removeAttribute('class')
            }
            break
        case 'right':
            if(bombermanIndex+1 < 390 && !availableSquares[bombermanIndex+1].classList.contains('wall')){
                availableSquares[bombermanIndex + 1].classList.add('bombermanGoingRight')
                availableSquares[bombermanIndex].removeAttribute('class')
            }
            break
        case 'down':
            if(bombermanIndex+30 <390 && !availableSquares[bombermanIndex+30].classList.contains('wall')){
                availableSquares[bombermanIndex + 30].classList.add('bombermanGoingDown')
                availableSquares[bombermanIndex].removeAttribute('class')
            }
            break
        case 'left':
            if(bombermanIndex-1 >=0 && !availableSquares[bombermanIndex-1].classList.contains('wall')){
                availableSquares[bombermanIndex - 1].classList.add('bombermanGoingLeft')
                availableSquares[bombermanIndex].removeAttribute('class')
            }
            break
    }
}