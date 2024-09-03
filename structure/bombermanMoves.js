import {availableSquares} from './buildGame.js'
import { breakWall } from './gameEvents.js'
import { width, height, players, powerUps } from './model.js'

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
    let checkIfSquareAvailable
    let moving
    switch(direction){
        case 'up':
            if(bombermanIndex-width >=0){
                checkIfSquareAvailable = availableSquares[bombermanIndex-width]
                moving = 'Up'
            }
            break
        case 'right':
            if(bombermanIndex+1 < width*height){
                checkIfSquareAvailable = availableSquares[bombermanIndex+1]
                moving = 'Right'
            }
            break
        case 'down':
            if(bombermanIndex+width <width*height){
                checkIfSquareAvailable = availableSquares[bombermanIndex+width]
                moving = 'Down'
            }
            break
        case 'left':
            if(bombermanIndex-1 >=0){
                checkIfSquareAvailable = availableSquares[bombermanIndex-1]
                moving = 'Left'
            }
            break
    }
    let squareClass = checkIfSquareAvailable.getAttribute('class')
    if (!squareClass || powerUps.includes(squareClass)){
        players[1].powerUp = squareClass
        checkIfSquareAvailable.removeAttribute('class')
        checkIfSquareAvailable.classList.add('bombermanGoing'+moving)
        availableSquares[bombermanIndex].classList.remove(bombermanFacing)
        keyStillDown = true
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
