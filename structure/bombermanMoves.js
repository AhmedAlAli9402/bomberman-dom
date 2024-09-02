import {availableSquares} from './buildGame.js'
import { breakWall } from './gameEvents.js'
import { players } from './buildGame.js'

let keyStillDown = false
let bombDropped = false

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
        case 'x':
            DropBomb()
            break
            }
    }
    
function moveBomberman(direction){
    if (keyStillDown){
        return
    }
    let bomberman = document.querySelector('.bombermanGoingUp')
     || document.querySelector('.bombermanGoingRight')
      || document.querySelector('.bombermanGoingDown')
       || document.querySelector('.bombermanGoingLeft') 
    let  bombermanFacing = bomberman.getAttribute('class')
    if (bombermanFacing.includes('bomb ')){
        bombermanFacing = bombermanFacing.split('bomb ')[1]
    } else if (bombermanFacing.includes(' bomb')){
        bombermanFacing = bombermanFacing.split(' bomb')[0]
    }
    let bombermanIndex = availableSquares.indexOf(bomberman)
    switch(direction){
        case 'up':
            if(bombermanIndex-23 >=0 && !availableSquares[bombermanIndex-23].getAttribute('class')){
                availableSquares[bombermanIndex - 23].classList.add('bombermanGoingUp')
                availableSquares[bombermanIndex].classList.remove(bombermanFacing)
                keyStillDown = true
            }
            break
        case 'right':
            if(bombermanIndex+1 < 390 && !availableSquares[bombermanIndex+1].getAttribute('class')){
                availableSquares[bombermanIndex + 1].classList.add('bombermanGoingRight')
                availableSquares[bombermanIndex].classList.remove(bombermanFacing)
                keyStillDown = true
            }
            break
        case 'down':
            if(bombermanIndex+23 <390 && !availableSquares[bombermanIndex+23].getAttribute('class')){
                availableSquares[bombermanIndex + 23].classList.add('bombermanGoingDown')
                availableSquares[bombermanIndex].classList.remove(bombermanFacing)
                keyStillDown = true
            }
            break
        case 'left':
            if(bombermanIndex-1 >=0 && !availableSquares[bombermanIndex-1].getAttribute('class')){
                availableSquares[bombermanIndex - 1].classList.add('bombermanGoingLeft')
                availableSquares[bombermanIndex].classList.remove(bombermanFacing)
                keyStillDown = true
            }
            break
    }
}

export function setKeyUp(){
    keyStillDown = false
}

function DropBomb(){
    if (bombDropped){
        return
    }
    let bomberman = document.querySelector('.bombermanGoingUp')
     || document.querySelector('.bombermanGoingRight')
      || document.querySelector('.bombermanGoingDown')
       || document.querySelector('.bombermanGoingLeft') 
    let bombermanIndex = availableSquares.indexOf(bomberman)
    availableSquares[bombermanIndex].classList.add('bomb')
    bombDropped = true
    setTimeout(()=>{breakWall();bombDropped=false}, 3000)
}
