import RiTa from 'rita'
import Matter from 'matter-js'
import TextNode from './TextNode'
import p5matter from './p5matter'

export default class SentenceEntity {

    constructor(p5, num, sentence, canvas) {
        window.p5 = p5;
        this.canvas = canvas
        this.hide = false;

        this.width = window.p5.width
        this.height = window.p5.height
        this.fontSize = window.fontSize
        if(num == 1){
            this.fontSize += 10
        }

        this.position = p5.createVector(0,0);
        this.oldPosition = p5.createVector(0,0);
        if (num === 0) {
            this.position.x = this.width * 0.15
        } else {
            this.position.x = this.width - this.width * 0.25
        }

        this.startingX = this.position.x

        if (num === 0) {
            this.position.y = 100
        } else {
            this.position.y = 100
        }
        this.linex;
        this.liney;
        this.speed = 20;

        this.color = "rgb(255,0,0)";
        this.saveColor = "white";



        this.hit = false
        this.score = 0;
        this.gate = false;
        this.overlap = false;

        this.num = num
        this.textNodes = []

        this.bullets = []
        this.bulletCount = 0;
        this.shootCharge = 0;
        this.isColliding = false;
        this.ctx = this.canvas.elt.getContext('2d')

        this.makeSentenceBlocks(sentence);
        this.controls = [38, 37, 40, 39, 32]
        this.life = this.textArray.length;



    }

    updatePosition(x,y){
        this.oldPosition = this.position;
        this.position.x = x;
        this.position.y = y;
    }

    makeSentenceBlocks(sentence) {
        this.sentence = sentence
        

        this.textArray = RiTa.tokenize(this.sentence);
        this.life = this.textArray.length;

        for (let i = 0; i < this.textArray.length; i++) {
            if (RiTa.isPunctuation(this.textArray[i])) {
                this.textArray[i - 1] = this.textArray[i - 1] + this.textArray[i]

                this.textArray.splice(i, 1);
            }
        }
        let x = 0;

        this.textArray.forEach((word, i) => {
            if(this.num == 0){
                word = word.toUpperCase();
            }
            let w = this.getWordWidth(word);
            
            let position = {
                x: this.position.x + x,
                y: this.position.y + Math.floor(i / 4) * this.fontSize*2 + 30
            }


            x += w
            if(w > 70) {
                x = 0
            }

            if (i % 3 === 2) {
                x = 0
            }




            let node = new TextNode(window.p5, position, word, w, this.canvas, i/this.textArray.length,(i+1)/this.textArray.length, this.num)
            this.textNodes.push(node)
        })

    }

    hide() {
        this.hide = true
    }

    show() {
        this.hide = false;
    }

    getWordWidth(word) {
        let w = 0
        for (let i = 0; i < word.length; i++) {

            w += this.ctx.measureText(word[i]).width * 1.55;


        }
        return w < 60 ? 60 : w
    }


    shoot() {


        let sign;
        //////console.log(this.bullets)

        // Player 1 logic ----------------------------------
        if (this.num === 0) {
            sign = p5matter.makeBall(this.position.x, this.position.y - 50, 15);

            // sign.body.friction = 0.5;



            sign.label = this.num
            sign.body.label = 0
            // //////console.log(this.bullets)

            // //////console.log("charge", this.shootCharge);


            let velocity = {
                x: 15,
                y: -22
            }
            Matter.Body.setVelocity(sign.body, velocity)

        } // Player 2 logic ---------------------------------- 
        else {
            sign = p5matter.makeBlock(this.position.x, this.position.y-50, 15, 15);
            // sign.body.friction = 0.5;


            sign.label = this.num
            sign.body.label = 1




            let velocity = {
                x: -15,
                y: -22
            }
            Matter.Body.setVelocity(sign.body, velocity)


        }



        this.bullets.push(sign)


    }


    // updateControls(controlData) {

    // }
    removeBullet(b) {
        //////console.log(b)
        b.render.visible = false;

        p5matter.forget(b)

        this.bullets.forEach((bullet, index) => {
            //////console.log(bullet)
            if (bullet.body.id === b.id) {
                ////console.log(bullet.id, b.id)
                ////console.log("found")
                this.bullets.splice(index, 1)
            }

        })
    }

    drawBullets() {
        window.p5.push();
        window.p5.noStroke();
        window.p5.fill(this.color)
        for (var i = this.bullets.length - 1; i >= 0; i--) {
            var b = this.bullets[i];
            b.show();
            if (b.isOffCanvas(100)) {
                p5matter.forget(b);
                this.bullets.splice(i, 1);
            }
        }
        window.p5.pop();

    }

    drawTextNodes() {
        if(this.hide === false){
        window.p5.push();
        window.p5.fill(255, 0, 0);
        window.p5.noStroke();
        let x = 0;
        this.textNodes.forEach((node, i) => {


            let w = this.getWordWidth(this.textArray[i]);
            let position = {
                x: this.position.x + x,
                y: this.position.y + Math.floor(i / 3) * this.fontSize
            }
            // ////console.log(this.fontSize)


            x += w

            if (i % 3 === 2) {
                x = 0
            }
            node.display(position)
        })
        window.p5.pop();
    }
    }


    display() {





        this.drawBullets()

        this.drawTextNodes()

    }

   revive() {
       this.life = this.textNodes.length;
       this.textNodes.forEach((node, index) => {
        node.revive();
    })
   }


}