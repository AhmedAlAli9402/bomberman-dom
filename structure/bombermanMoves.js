import {availableSquares} from './buildGame.js'

let keyStillDown = false
let facing = "down"
let bombDropped = false

export function changeDirection(e){
    switch(e.key){
        case 'ArrowUp':
            facing = "up"
            moveBomberman("up")
            break
        case 'ArrowRight':
            facing = "right"
            moveBomberman("right")
            break
        case 'ArrowDown':
            facing = "down"
            moveBomberman("down")
            break
        case 'ArrowLeft':
            facing = "left"
            moveBomberman("left")
            break
        case 'x':
            DropBomb(facing)
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
    let bombermanIndex = availableSquares.indexOf(bomberman)
    switch(direction){
        case 'up':
            if(bombermanIndex-30 >=0 && (!availableSquares[bombermanIndex-30].classList.contains('wall') && !availableSquares[bombermanIndex-30].classList.contains('breakableWall'))){
                availableSquares[bombermanIndex - 30].classList.add('bombermanGoingUp')
                availableSquares[bombermanIndex].removeAttribute('class')
                keyStillDown = true
            }
            break
        case 'right':
            if(bombermanIndex+1 < 390 && (!availableSquares[bombermanIndex+1].classList.contains('wall') && !availableSquares[bombermanIndex+1].classList.contains('breakableWall'))){
                availableSquares[bombermanIndex + 1].classList.add('bombermanGoingRight')
                availableSquares[bombermanIndex].removeAttribute('class')
                keyStillDown = true
            }
            break
        case 'down':
            if(bombermanIndex+30 <390 && (!availableSquares[bombermanIndex+30].classList.contains('wall') && !availableSquares[bombermanIndex+30].classList.contains('breakableWall'))){
                availableSquares[bombermanIndex + 30].classList.add('bombermanGoingDown')
                availableSquares[bombermanIndex].removeAttribute('class')
                keyStillDown = true
            }
            break
        case 'left':
            if(bombermanIndex-1 >=0 && (!availableSquares[bombermanIndex-1].classList.contains('wall') && !availableSquares[bombermanIndex-1].classList.contains('breakableWall'))){
                availableSquares[bombermanIndex - 1].classList.add('bombermanGoingLeft')
                availableSquares[bombermanIndex].removeAttribute('class')
                keyStillDown = true
            }
            break
    }
}

export function setKeyUp(){
    keyStillDown = false
}

function DropBomb(facing){
    if (bombDropped){
        return
    }
    let bomberman = document.querySelector('.bombermanGoingUp')
     || document.querySelector('.bombermanGoingRight')
      || document.querySelector('.bombermanGoingDown')
       || document.querySelector('.bombermanGoingLeft') 
    let bombermanIndex = availableSquares.indexOf(bomberman)
    switch(facing){
        case 'up':
            if(bombermanIndex-30 >=0 && (!availableSquares[bombermanIndex-30].classList.contains('wall') && !availableSquares[bombermanIndex-30].classList.contains('breakableWall'))){
            availableSquares[bombermanIndex - 30].classList.add('bomb')
            bombDropped = true
            }
            break
        case 'down':
            if(bombermanIndex+30 <390 && (!availableSquares[bombermanIndex+30].classList.contains('wall') && !availableSquares[bombermanIndex+30].classList.contains('breakableWall'))){
            availableSquares[bombermanIndex + 30].classList.add('bomb')
            bombDropped = true
            }
            break
        case 'right':
            if(bombermanIndex+1 < 390 && (!availableSquares[bombermanIndex+1].classList.contains('wall') && !availableSquares[bombermanIndex+1].classList.contains('breakableWall'))){
            availableSquares[bombermanIndex + 1].classList.add('bomb')
            bombDropped = true
            }
            break
        case 'left':
            if(bombermanIndex-1 >=0 && (!availableSquares[bombermanIndex-1].classList.contains('wall') && !availableSquares[bombermanIndex-1].classList.contains('breakableWall'))){
            availableSquares[bombermanIndex - 1].classList.add('bomb')
            bombDropped = true
            }
            break
            }
            setTimeout(breakWall, 3000)
}

function breakWall(){
    let bomb = document.getElementsByClassName("bomb")
    let divId = bomb[0].getAttribute("id")
    let id = Number(divId.substring(3))
    if (availableSquares[id-1].classList.contains('breakableWall')){
        availableSquares[id-1].classList.add("breakWall")
        availableSquares[id-1].classList.remove('breakableWall')
    }
    if (availableSquares[id+1].classList.contains('breakableWall')){
        availableSquares[id+1].classList.add("breakWall")
        availableSquares[id+1].classList.remove('breakableWall')
    }
    if (availableSquares[id+30].classList.contains('breakableWall')){
        availableSquares[id+30].classList.add("breakWall")
        availableSquares[id+30].classList.remove('breakableWall')
    }
    if (availableSquares[id-30].classList.contains('breakableWall')){
        availableSquares[id-30].classList.add("breakWall")
        availableSquares[id-30].classList.remove('breakableWall')
    }
    bomb[0].removeAttribute("class")
    bombDropped = false
}