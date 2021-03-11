// NOTE: Set canvas size.
//       This size is set in css. See style.scss.

/* eslint-disable  */

import p5matter from './p5matter'

import Colours from './Colours'

import GameEngine from './GameEngine'

import ControlHandler from './ControlHandler'

import gsap from 'gsap'

export let sketch = (p5) => {
    // make library globally available
    window.p5 = p5;
    const initialCanvas = document.getElementById('canvas');
    var fontSize = 22;
    window.fontSize = 25;
    let canvas;
    let gameEngine;
    let dimensions = [1920, 1080];
    let rect1 = {
        x:0,
        
        w: dimensions[0] / 2,
        
    }
    let rect2 = {
        x: dimensions[0] / 2,
        w: dimensions[0] / 2,
    }

    let gameEnded = false;
    
    p5.setup = () => {
        canvas = p5.createCanvas(dimensions[0], dimensions[1])
        // NOTE: Fit p5 canvas with parent container. 
        //       Now p5 canvas will be set as fullscreen inside parent.
        canvas.parent('canvas');
        // p5.frameRate(30);
        p5.textFont('Times New Roman', fontSize);
        gameEngine = new GameEngine(p5, canvas, dimensions)

        window.addEventListener('winnerPlayer1', () => {
            endGame(0);
        })

        window.addEventListener('winnerPlayer2', () => {
            endGame(1);
        })

        window.addEventListener('rematch', () => {
            refreshGame()
        })

    }

    p5.draw = () => {
        
        if(!gameEnded){
            p5.push();
            p5.noStroke();
            p5.fill(0,0,0,120);
            p5.rect(rect1.x, 0, rect1.w, dimensions[1]);
            p5.fill(255,255,255,100);
            p5.rect(rect2.x, 0, rect2.w, dimensions[1]);
            p5.pop();
        } else {
            p5.background(255,255,255);
            p5.push();
            p5.noStroke();
            p5.fill(0,0,0,255);
            p5.rect(rect1.x, 0, rect1.w, dimensions[1]);
            p5.fill(255,255,255,255);
            p5.rect(rect2.x, 0, rect2.w, dimensions[1]);
            p5.pop();
        }

        p5matter.manualTick();
        gameEngine.update()
        gameEngine.display(p5)



        ControlHandler.update()


      








    }

    function endGame(winner) {
        gameEnded = true;
        
        if(winner == 0){
            gsap.to(rect1, 2, {
                w: 1920,
                ease: "expo.inOut",
                onUpdate: ()=>{
                    console.log(rect1.w)
                }
            })
            gsap.to(rect2, 2, {
                x: 1920,
                w: 0,
                ease: "expo.inOut",
                onUpdate: ()=>{
                    console.log(rect1.w)
                }
            })
        } else {
            gsap.to(rect2, 2, {
                x: 0,
                w: 1920,
                ease: "expo.inOut",
                onUpdate: ()=>{
                    console.log(rect2.w)
                }
            })
        }
    }

    function refreshGame() {
        gsap.to(rect2, 1, {
            x: dimensions[0] / 2,
            w: dimensions[0]/2,
            ease: "expo.inOut",
            onUpdate: ()=>{
                
            }
        })
        gsap.to(rect1, 1, {
            x: 0,
            w: dimensions[0]/2,
            ease: "expo.inOut",
            onUpdate: ()=>{
                console.log(rect1.w)
            }
        })
    }






}