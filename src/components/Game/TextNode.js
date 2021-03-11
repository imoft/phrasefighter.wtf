import gsap from '../../gsap_local/all'
import p5matter from './p5matter'
import Matter from 'matter-js'
import { CustomEase } from "../../gsap_local/CustomEase";

gsap.registerPlugin(CustomEase);
export default class TextNode {


    constructor(p5, position, word, width, canvas, ratio,nextRatio, num) {
        this.p5 = p5;
      
        this.fontSize = window.fontSize;
        if(num == 1){
            this.fontSize = this.fontSize*1.1
        }
        this.num = num;
        this.position = position;
        this.word = word;
        this.width = width
        this.canvas = canvas
        this.height = this.fontSize;
        this.color = 'white'
        this.isDead = false;
        this.block = p5matter.makeBlock(this.position.x, this.position.y + this.height * 0.5, this.width, this.height)
        this.block.body.isSensor = true;
        this.block.body.isStatic = true;
        this.block.body.label = num;
        this.ctx = this.canvas.elt.getContext('2d')
        this.letterPositions = []
        let d = 0
        this.opacity = 0.5;
        this.ratio = ratio;
        this.nextRatio = nextRatio;
        this.ratioDiff = nextRatio - ratio;
        this.block.body.render.fillStyle = "red"
        this.explosionTime = 0.5;
        
        this.randInts = []
        for (let i = 0; i < this.word.length; i++) {
            this.letterPositions[i] = {
                x: this.position.x + d,
                y: this.position.y + this.fontSize
            }
            this.randInts.push(Math.floor(Math.random() * 5))

            d += this.ctx.measureText(this.word[i]).width
            

        }
        this.kill = false;
        this.t = 0

        this.dirY = 1;
        
        


        
        this.oldLetterPositions = []

    }

    clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    }

    revive() {
        this.isDead = false;
        this.kill = false;

        //console.log(this.revive);

        let d = 0
        for (let i = 0; i < this.word.length; i++) {
            gsap.to(this.letterPositions[i], 2.0, {
                x: this.position.x + d,
                y: this.position.y + this.fontSize,
                ease: 'ease-in',
            })
            this.randInts.push(Math.floor(Math.random() * 5))

            d += this.ctx.measureText(this.word[i]).width

        }

        p5matter.forget(this.block);

        this.block = p5matter.makeBlock(this.position.x, this.position.y + this.height * 0.5, this.width, this.height)
        this.block.body.isSensor = true;
        this.block.body.isStatic = true;
        this.block.body.label = this.num;

    }

    display(position) {
        this.t += 1;
        if(position.y < this.position.y){
            this.dirY = -1
        } else {
            this.dirY = 1;
        }
        this.position = position


        // //console.log(this.position)
        // if (this.kill === false) {
        //     if (this.isDead === false) {

        //     }

        this.block.setPosition(this.position.x + this.width * 0.5, this.position.y + this.height * 0.5)
        let d = 0
        this.p5.noStroke()
        for (let i = 0; i < this.word.length; i++) {
            if (this.isDead === false) {

                if (this.oldLetterPositions.length > 0) {
                    this.letterPositions[i] = {
                        x: this.p5.lerp(this.oldLetterPositions[i].x, this.position.x + d, 0.3 + 0.6*(this.ratio + i*(this.ratioDiff/(this.word.length)))),
                        y: this.p5.lerp(this.oldLetterPositions[i].y, this.position.y + this.fontSize,  0.4 + 0.5*(this.ratio + i*this.dirY*(this.ratioDiff/(this.word.length))))

                        // x: this.p5.lerp(this.oldLetterPositions[i].x, this.position.x + d,0.6),
                        // y: this.p5.lerp(this.oldLetterPositions[i].y, this.position.y + this.fontSize, 0.65)
                    }

                   
            
                    
              
                } else {
                    this.letterPositions[i] = {
                        x: this.position.x + d,
                        y: this.position.y + this.fontSize
                    }
                }


            }

            
            if (this.isDead) {
                this.p5.text(this.word[i], this.letterPositions[i].x, this.letterPositions[i].y);
                d += this.ctx.measureText(this.word[i]).width
            } else {
                this.p5.text(this.word[i], this.letterPositions[i].x, this.letterPositions[i].y + Math.sin(this.t * this.randInts[i] * 0.05));
                d += this.ctx.measureText(this.word[i]).width
            }


        }

        this.oldLetterPositions = this.letterPositions
        // this.p5.push()
        // this.p5.noFill();
        // this.p5.stroke("red")
        // this.p5.rect(this.position.x, this.position.y, this.width, this.fontSize);
        // this.p5.pop()
       
      
        //     }



    }
    randSign() {

        return Math.random()>0.5 ? -1 : 1
    }

    fallDown(shouldSpeak = true, explosionTime=0.5) {
        //console.log("hit")

        if(window.speechSynthesis && shouldSpeak){
            let utter = new SpeechSynthesisUtterance(this.word);
            utter.rate = 1;
            utter.pitch = 0.5 + Math.random()*2.0;
            utter.volume = 0.5;

        window.speechSynthesis.speak(utter);
        }
        this.isDead = true;


        for (let i = 0; i < this.word.length; i++) {

            let sign1 = this.randSign();
            let sign2 = this.randSign();

            gsap.to(this.letterPositions[i], explosionTime, {
                ease: CustomEase.create("custom", "M0,0 C0.01,0.62 0.542,0.858 1,1 "),
                x:  this.letterPositions[i].x + sign1*(50 + Math.random()*100),
                y:  this.letterPositions[i].y - (50 + Math.random()*100),
                
                onUpdate: () => {},
                onComplete: () => {
                    if (i === this.word.length - 1) {
                        this.kill = true;
                    }
                    gsap.to(this.letterPositions[i], explosionTime+0.25, {
                        ease: CustomEase.create("custom", "M0,0 C0,0 0.18,-0.027 0.336,0.2 0.518,0.466 0.68,0.993 0.681,0.999 0.683,0.994 0.695,0.962 0.706,0.941 0.713,0.926 0.719,0.917 0.728,0.904 0.735,0.895 0.741,0.888 0.75,0.882 0.756,0.878 0.764,0.875 0.772,0.875 0.78,0.874 0.788,0.877 0.795,0.882 0.804,0.888 0.811,0.896 0.818,0.906 0.827,0.919 0.832,0.928 0.84,0.943 0.85,0.964 0.859,0.99 0.863,0.999 0.867,0.995 0.877,0.982 0.887,0.975 0.894,0.971 0.902,0.968 0.91,0.968 0.917,0.968 0.925,0.972 0.932,0.977 0.941,0.983 0.948,0.993 0.954,0.999 0.96,0.997 0.969,0.992 0.976,0.992 0.984,0.992 1,1 1,1 "),
                        y: window.p5.height-20,     
                        x:  this.letterPositions[i].x + sign1*(25),
       
                        onUpdate: () => {},
                        onComplete: () => {
                            if (i === this.word.length - 1) {
                                this.kill = true;
                            }
                        }
                    })
                }
            })
        }

    }

    endGame(winner) {
        // let dir = winner == 0 ? 1 : -1;
        // for (let i = 0; i < this.word.length; i++) {

        //     gsap.to(this.letterPositions[i], 0.5, {
        //         x: dir*1000.

        //     })
        // }
    }

    destroy() {

        p5matter.forget(this.block);

    }




}