import {availableSquares} from './buildGame.js'
import { players } from './buildGame.js'

function explosion(id){
if (!availableSquares[id-30].getAttribute('class')){
    availableSquares[id-30].classList.add("explosionTop")
    setTimeout(()=>{availableSquares[id-30].classList.remove("explosionTop")}, 200)
}
if (!availableSquares[id+30].getAttribute('class')){
    availableSquares[id+30].classList.add("explosionBottom")
    setTimeout(()=>{availableSquares[id+30].classList.remove("explosionBottom")}, 200)
}
if (!availableSquares[id-1].getAttribute('class')){
    availableSquares[id-1].classList.add("explosionLeft")
    setTimeout(()=>{availableSquares[id-1].classList.remove("explosionLeft")}, 200)
}
if (!availableSquares[id+1].getAttribute('class')){
    availableSquares[id+1].classList.add("explosionRight")
    setTimeout(()=>{availableSquares[id+1].classList.remove("explosionRight")}, 200)
}
}

export function breakWall(){
    let bomb = document.getElementsByClassName("bomb")
    let bombIndex = availableSquares.indexOf(bomb[0])
    let id = Number(bomb[0].getAttribute("id"))
    explosion(id)
    checkIfPlayerInBlastRadius(id)
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
    let elementsWithBreakWall = document.getElementsByClassName('breakWall') 
    availableSquares[bombIndex].classList.remove("bomb")
    availableSquares[bombIndex].classList.add("explosion")
    setTimeout(()=>{availableSquares[bombIndex].classList.remove("explosion")}, 200)
    for(let i=0;i<elementsWithBreakWall.length;i++){
        let element = elementsWithBreakWall[i]
    setTimeout(()=>{element.classList.remove('breakWall')}, 500)
    }
}

function checkIfPlayerInBlastRadius(id){
    let bomberman = document.querySelector('.bombermanGoingUp')
    || document.querySelector('.bombermanGoingRight')
    || document.querySelector('.bombermanGoingDown')
    || document.querySelector('.bombermanGoingLeft') 
    let bombermanIndex = availableSquares.indexOf(bomberman)
    if (bombermanIndex === id){
        killPlayer(bomberman)
    } else if (bombermanIndex === id-1){
        killPlayer(bomberman)
    } else if (bombermanIndex === id+1){
        killPlayer(bomberman)
    } else if (bombermanIndex === id+30){
        killPlayer(bomberman)
    } else if (bombermanIndex === id-30){
        killPlayer(bomberman) 
    }
}

function killPlayer(bomberman){
    bomberman.classList.add("dead")
    setTimeout(()=>{bomberman.classList.remove("dead")}, 500)
}