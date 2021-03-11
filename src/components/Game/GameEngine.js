// NOTE: Set canvas size.
//       This size is set in css. See style.scss.

/* eslint-disable  */
import Matter from 'matter-js'
import ConnectionHandler from './ConnectionHandler'
import SentenceEntity from './SentenceEntity'
import p5matter from './p5matter'
import {
    debounce
} from './utils'
import gsap from 'gsap'
import {
    Howl,
    Howler
} from 'howler'
import audiofile from '../..//assets/audio/pew.mp3'



import ControlHandler from './ControlHandler'


export default class GameEngine {

    constructor(p5, canvas, dimensions) {
        this.state = {
            p1: {

            },
            p2: {

            }
        }
        window.Matter = Matter;

        this.showPlayer2 = ConnectionHandler.playerNum === 0 ? false : true;

        this.dimensions = dimensions;

        this.canvas = canvas;
        this.sound = new Howl({
            src: [audiofile],
            autoplay: false,
            loop: false,
            volume: 0.33,
            onend: function () {
                // console.log('Finished!');
            }
        });

        if (this.playerNum == 0) {
            this.sound.stereo(-1);
            this.sound.rate(0.56);
        } else {
            this.sound.stereo(1);
            this.sound.rate(1.56);
        }

        this.connection = ConnectionHandler;
        this.playerNum = this.connection.playerNum

        this.physics = p5matter.init(true);
        window.engine = this.physics;
        p5matter.changeGravity(0, 1.2);
        var extra = 300;
        var floor = p5matter.makeBarrier(
            p5.width / 2, p5.height + extra * 0.75, p5.width + 2 * extra, 2 * extra);
        floor.body.label = "floor"
        //console.log(floor)

        var ceiling = p5matter.makeBarrier(
            p5.width / 2, -extra, p5.width + 2 * extra, 2 * extra);
        var leftWall = p5matter.makeBarrier(
            -extra, p5.height / 2, 2 * extra, p5.height + 2 * extra);
        var rightWall = p5matter.makeBarrier(
            p5.width + extra, p5.height / 2, 2 * extra, p5.height + 2 * extra);


        if (ConnectionHandler.playerNum === 0) {
            let height = p5.height * 0.5 < 800 ? p5.height * 0.5 : p5.height * 0.3;
            this.faceBall = p5matter.makeBarrierBall(p5.width * 0.5 + window.innerWidth * 0.25, p5.height * 0.5 - window.innerHeight * 0.1, 80);

        } else {
            this.faceBall = p5matter.makeBarrierBall(p5.width * 0.5 - window.innerWidth * 0.25, p5.height * 0.5 - window.innerHeight * 0.1, 80);

        }
        this.faceBall.body.label = "faceball"


        this.speed = 25;
        this.controls = {
            "UP": 38,
            "LEFT": 37,
            "DOWN": 40,
            "RIGHT": 39,
            "SHOOT": 32
        }

        this.shoot1 = debounce((p) => {
            p.shoot();
            this.sound.rate(1.2 + Math.random() * 0.3);

            this.sound.play();

        }, 76)
        this.shoot2 = debounce((p) => {
            p.shoot();
            this.sound.rate(1.2 + Math.random() * 0.3);

            this.sound.play();

        }, 76)

        if (this.playerNum === 1) {
            this.createPlayer2()
        } else if (this.playerNum === 0) {
            this.player1 = new SentenceEntity(p5, 0, ConnectionHandler.sentences[0], this.canvas)
            this.player1.position.x = this.dimensions[0] * 0.25;
            this.player1.position.y = this.dimensions[1] * 0.4;
        }




        Matter.Events.on(this.physics, 'collisionStart', (event) => {
            let a = event.pairs[0].bodyA;
            let b = event.pairs[0].bodyB;

            this.checkNodes(a, b)

        });

        window.addEventListener('start', () => {

            //console.log("START");
            this.playerNum = this.connection.playerNum

            Matter.World.remove(this.physics.world, this.faceBall.body);

            this.createPlayer2();



            this.faceBall = null

            this.player1.position.x = this.dimensions[0] * 0.25;
            this.player1.position.y = this.dimensions[1] * 0.4;
            this.player2.position.x = this.dimensions[0] * 0.6;
            this.player2.position.y = this.dimensions[1] * 0.4;


        })

        window.addEventListener('reset', () => {
            this.player1 = new SentenceEntity(p5, 0, ConnectionHandler.sentences[0], this.canvas)

            //console.log("RESET");
            this.player2.position.x = this.dimensions[0] * 0.6;
            this.player2.position.y = this.dimensions[1] * 0.4;
            this.player1.position.x = this.dimensions[0] * 0.25;
            this.player1.position.y = this.dimensions[1] * 0.4;

            if (this.faceBall) {
                Matter.World.remove(this.physics.world, this.faceBall.body);


                this.faceBall = null
            }
        })

        window.addEventListener('rematch', () => {
            this.rematch();
        })



        window.addEventListener('winnerPlayer1', () => {
            this.endGame(0);
        })

        window.addEventListener('winnerPlayer2', () => {
            this.endGame(1);
        })



    }

    createPlayer2() {
        this.player2 = new SentenceEntity(p5, 1, ConnectionHandler.sentences[1], this.canvas)
        this.player2.position.x = this.dimensions[0] * 0.6;
        this.player2.position.y = this.dimensions[1] * 0.4;

    }

    update() {


        if (this.playerNum === 0) {
            this.updatePositionFromControls(this.player1, 0);
            this.updateOpponentFromConnection(this.player2, 1);
        } else {
            this.updatePositionFromControls(this.player2, 1);
            this.updateOpponentFromConnection(this.player1, 0);
        }






    }

    setSound(pew) {
        this.pew = pew;
    }

    display(p5) {
        p5.push();
        p5.textFont('Work Sans', window.fontSize);
        if (this.player1) {
            this.player1.display()
        }
        p5.pop()
        p5.textFont('Times New Roman', window.fontSize + 5);

        if (this.player2) {
            this.player2.display()
        }
        p5.push();
        if (this.showPlayer2) {
            p5.fill("white");

        } else {
            p5.fill("#EE2E19");
        }
        if (this.faceBall) {
            this.faceBall.show();
        }
        p5.pop()

        // If solo

        if (ConnectionHandler.solo && p5.frameCount % 10 == 0) {
            const r = Math.floor(Math.random()*8);
            console.log(r);
            switch (r) {
                case 2:
                    this.moveUp(this.player2, 3)
                 
                   
                    break;
                case 1:
                    this.moveDown(this.player2, 4)
                 
                    break;
                case 3:
                    this.moveLeft(this.player2, 1, 4)
                

                    break;
                case 0:
                    this.moveRight(this.player2, 1, 2)
                

                    break;
                case 4:
                    this.shoot2(this.player2)
                    break;
                  
                default:
                    break;
            }
        }
    }

    endGame(winner) {
        if (winner == 0) {
            this.player1.textNodes.forEach((node, index) => {
                node.revive();
            })


            this.player2.textNodes.forEach((node, index) => {
                if (!node.isDead) {
                    node.fallDown(false, 2.5);
                }
                node.endGame(0)
            })
        } else if (winner == 1) {
            this.player2.textNodes.forEach((node, index) => {
                node.revive();
            })
            this.player1.textNodes.forEach((node, index) => {
                if (!node.isDead) {
                    node.fallDown(false, 2.5)
                }
                node.endGame(1)
            })
        }
    }

    rematch() {
        this.player1.revive();
        this.player2.revive();

    }

    updateOpponentFromConnection(p, num) {

        if (!p) {
            return;
        }

        let keys = ControlHandler.opponentKeysDown


        for (let index in keys) {
            // //console.log("Setting opponent player state")
            switch (keys[index]) {
                case this.controls.UP:

                    this.moveUp(p);
                    break;
                case this.controls.DOWN:
                    this.moveDown(p);
                    break;
                case this.controls.LEFT:
                    this.moveLeft(p, num);
                    break;
                case this.controls.RIGHT:
                    this.moveRight(p, num);
                    break;
                case this.controls.SHOOT:
                    if(num==0){
                        this.shoot1(p);
                    } else if (num == 1){
                        this.shoot2(p);
                    }



                    break;
                default:
                    break;
            }
        }
    }

    updatePositionFromControls(p, num) {
        if (!p) {
            return;
        }
        let keys = ControlHandler.keysDown
        ConnectionHandler.broadcastGameState(keys)

        for (let index in keys) {
            // //console.log("Setting opponent player state")
            switch (keys[index]) {
                case this.controls.UP:

                    this.moveUp(p);
                    break;
                case this.controls.DOWN:
                    this.moveDown(p);
                    break;
                case this.controls.LEFT:
                    this.moveLeft(p, num);
                    break;
                case this.controls.RIGHT:
                    this.moveRight(p, num);
                    break;
                case this.controls.SHOOT:
                    if(num==0){
                        this.shoot1(p);
                    } else if (num == 1){
                        this.shoot2(p);
                    }


                    break;
                default:
                    break;
            }
        }
    }



    moveLeft(p, num, mult=1) {
        if (num === 0) {
            if ((p.position.x - this.speed*mult < 0)) {
                p.position.x = 0
            } else {
                p.position.x -= this.speed*mult;
            }
        } else if (num === 1) {
            if ((p.position.x - this.speed*mult < this.dimensions[0] * 0.5)) {
                p.position.x = this.dimensions[0] * 0.5
            } else {
                p.position.x -= this.speed*mult;
            }
        }

    }

    moveRight(p, num, mult=1) {
        if (num === 0) {
            if ((p.position.x + this.speed*mult) >= this.dimensions[0] * 0.3) {
                p.position.x = this.dimensions[0] * 0.3
            } else {
                p.position.x += this.speed*mult;

            }

        } else if (num === 1) {
            if ((p.position.x + this.speed*mult) >= this.dimensions[0]) {
                p.position.x = this.dimensions[0]
            } else {
                p.position.x += this.speed*mult;

            }

        }
    }

    moveUp(p, mult=1) {
        if ((p.position.y - this.speed*mult) < 0) {
            p.position.y = 0
        } else {
            p.position.y -= this.speed*mult;
        }

    }

    moveDown(p, mult=1) {

        if ((p.position.y + this.speed*mult) >= this.dimensions[1] - 100) {
            p.position.y = this.dimensions[1] - 100
        } else {
            p.position.y += this.speed*mult;
        }

    }



    // 
    checkNodes(a, b) {
        //console.log(a.label, b.label)



        if (a.label == "faceball") {
            //console.log(a)
            gsap.to(a, 0.5, {
                angle: 2 * Math.PI,

                onComplete: () => {
                    a.angle = 0;

                }
            })
            a.mass = 1;
            // a.isStatic = false


        }
        if (a.label == "floor") {
            Matter.World.remove(this.physics.world, b);

            if (this.player2) {
                this.player2.removeBullet(b)
            }
            if (this.player1) {
                this.player1.removeBullet(b)
            }
        }

        if (a.label != b.label) {

            // //console.log("DEMO", ConnectionHandler.demo)

            if (this.player1) {
                this.player1.textNodes.forEach((node, index) => {
                    // //////console.log(node.block.body.id,)

                    //////console.log(b)



                    if (node.block.body.id === a.id || node.block.body.id === b.id) {

                        //////console.log("hit")
                        Matter.World.remove(this.physics.world, a);
                        Matter.World.remove(this.physics.world, b);
                        this.player2.removeBullet(b)
                        if (ConnectionHandler.demo === false) {

                            if (this.player1.life == 1) {
                                node.fallDown(true, 2.5);

                            }
                            node.fallDown(true);
                            this.player1.life -= 1;
                            //console.log(this.player1.life);
                            if (this.player1.life <= 0) {
                                ConnectionHandler.sendVictory(1);


                            }
                        }
                        return;
                    }

                })
            }
            if (this.player2) {
                this.player2.textNodes.forEach((node, index) => {
                    // //////console.log(node.block.body.id,)


                    if (node.block.body.id === a.id || node.block.body.id === b.id) {
                        //////console.log("hit")
                        Matter.World.remove(this.physics.world, a);
                        Matter.World.remove(this.physics.world, b);
                        this.player1.removeBullet(b)
                        if (ConnectionHandler.demo === false) {
                            if (this.player2.life == 1) {
                                node.fallDown(true, 2.5);

                            } else {
                                node.fallDown()
                            }
                            //console.log(this.player2.life);
                            this.player2.life -= 1;
                            if (this.player2.life <= 0) {
                                ConnectionHandler.sendVictory(0);


                            }
                        }
                        return;
                    }

                })
            }
        }
    }

}