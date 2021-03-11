<template>
<div>
         <ul  v-if="gameOver" style="top:0px; z-index: 2" class="nav nav-tabs d-flex justify-content-between align-items-center">
            <li class="nav-item"><button @click="openInNewTab" class="btn btn-secondary bg-red" type="button">Phrase
                    <span>fighter</span></button></li>
            <li class="nav-item"><button @click="goToPromote" class="btn btn-secondary"
                    type="button">@imaginationofthings</button></li>
            <li class="nav-item"><button @click="rematch" class="btn btn-primary red-bg spin" type="button"
                    style="font-size: 15px;letter-spacing: .5px;">Rematch</button></li>
        </ul>
        <winner v-if="gameOver" :winner="winner"></winner>

        <div class="halfcontainer bg-black-white noisy" id="canvas">
    
            <div class="noisy overlay">

            </div>

            <div v-if="playerNum==0 && demo">
                <div class="controls">
                    <tutorial :isLight="true"></tutorial>

                </div>
                <div class="player-2-join">
                    <h4 style="letter-spacing: 0px;font-size: 20px; margin-bottom: 20px"> Send an adversary a link to
                        join the game </h4>
                    <button class="btn btn-secondary" type="button" @click="copyToClipboard" id="copy-link">
                        {{copyText}}
                    </button>
                     <h4 style="letter-spacing: 0px;font-size: 20px; margin: 10px 0px">Or</h4>
                    <button class="btn btn-secondary" type="button" @click="playAlone" id="copy-link">
                     Play alone
                    </button>
                </div>
            </div>

            <div v-if="playerNum==1 && demo">
                <div class="controls-2">
                    <tutorial :isLight="false"></tutorial>
                </div>

                <div class="player-1-join">
                    <div @click="readyGame" class="round-btn red-bg spin">
                        <h3>Start</h3>
                    </div>

                </div>

            </div>


        </div>

                 <button v-b-toggle.sidebar-1 class="btn btn-info" id="info-button" type="button">?</button>

            <b-sidebar style="z-index: 5000" id="sidebar-1" title="" right shadow>
                <div class="px-3 py-2">
                    <p>
                        Phrase Fighter is a simple metaphor of our current public conversation. We choose sources of
                        information, we extract just the headline/tweet/tagline that has similarity with our “belief
                        filters”, and in the end, none of it really matters because it’s all about shooting the
                        opponents’
                        words.

                    </p>
                    <p>
                        This project was produced by <a href="https://www.imaginationofthings.com"
                            target="_blank">Imagination of Things</a>, a creative studio commited to unlocking new
                        possibilities around design, technology, and play.
                    </p>
                </div>
            </b-sidebar>
</div>
    
</template>

<script>
import ConnectionHandler from '../components/Game/ConnectionHandler'
import { sketch } from '../components/Game/GameCanvas'
import p5 from 'p5'
import Tutorial from '../components/Tutorial'
import Winner from '../components/Winner'
import html2canvas from 'html2canvas';

export default {
    components: {
        'tutorial': Tutorial,
        'winner': Winner,
    },
    data() {
        return {
            engine: null,

            connection: null,
            keysDown: [],
            lastTime: null,
            currentTime: null,
            gameID: "",
            test: false,
            demo: true,
            playerNum: 0,
            gameOver: false,
            winner: null,
            copyText: "Copy Link to clipboard"
        }
    },
    mounted() {
        this.playerNum = ConnectionHandler.playerNum
        this.engine = new p5(sketch)

        if(this.demo == false){
            ConnectionHandler.demo = false;
        }
        


        if (this.playerNum == 1) {
            ConnectionHandler.sendSentence()
        }

        window.addEventListener('start', () => {
            this.demo = false;
            ConnectionHandler.demo = false
            

        })

        window.addEventListener('end', () => {

            console.log("winner")

            this.gameOver = true
            this.winner = ConnectionHandler.winner;

            this.animateOut(this.winner);
        })

        window.addEventListener('rematch', ()=>{
            this.winner = null;
              
                        this.gameOver = false
        })


    },

    beforeDestroy() {
        
        window.Matter.Engine.clear(window.engine);
        this.engine = null;

    },

    destroyed() {
    
    },

    methods: {
        openInNewTab(url) {
            window.location.replace(window.location.protocol + "//" + window.location.host);
        },

        playAlone() {
             const event = new Event('start');
        window.dispatchEvent(event);
        ConnectionHandler.setOnePlayer();
        },

        goToPromote() {
            let win = window.open('https://www.instagram.com/imaginationofthings/', '_blank');
            win.focus();
        },
        copyToClipboard() {
            // this.$refs.tooltip.$emit('open')

           
            if (!navigator.clipboard) {
                // Clipboard API not available
                return
            }
            navigator.clipboard.writeText(ConnectionHandler.getLink())
                .then(() => {
                    // Success!
                this.copyText = "Copied!"
                setTimeout(()=>{
                    this.copyText = "Copy Link to clipboard"
                }, 1000)



                })
                .catch(err => {
                    console.log('Something went wrong', err);
                });

        },

        readyGame() {
            ConnectionHandler.sendStartMessage();
   


        },

        rematch() {
            this.winner = null;
                        this.gameOver = false

            console.log("rematch");
            ConnectionHandler.sendRematchMessage();
            const event = new Event('rematch');
            window.dispatchEvent(event);
        },

        goHome() {
            ConnectionHandler.destroy();
            this.$router.push({path:'/'});
        },

        animateOut(winner){

            if(this.winner == 0) {
                const event = new Event('winnerPlayer1');
                window.dispatchEvent(event);
            } else if (this.winner == 1) {
                const event = new Event('winnerPlayer2');
                window.dispatchEvent(event);
            }

        }

    }

}
</script>

<style >

.overlay {
    width: 100%;
    height: 100vh;
    z-index: 1;
}
.gameover-banner-1 {
      background: linear-gradient(138deg, #c5c5c5, #ffffff, #ee2e19);
  background-size: 700% 700%;
  -webkit-animation: gradientRoll 4s ease infinite;
  -moz-animation: gradientRoll 4s ease infinite;
  animation: gradientRoll 4s ease infinite;
    z-index: 123;
    color: black;
    position: absolute;
    left: 25%;
    top: 25%;
    transform: rotate(324deg) translate(-50%, 10px);
    padding: 0px 20px;
    transition: opacity 1s;
    opacity: 0;
}

.gameover-banner-2 {
   background: linear-gradient(138deg, black, #2a2a2a, #ee2e19);
  background-size: 700% 700%;
  -webkit-animation: gradientRoll 4s ease infinite;
  -moz-animation: gradientRoll 4s ease infinite;
  animation: gradientRoll 4s ease infinite;
    opacity: 0;
    z-index: 123;
    color:white;
     position: absolute;
    left: 75%;
    top: 50%;
    transform: rotate(45deg) translate(-50%, 10px);
    padding: 0px 20px;
    transition: opacity 1s;
}

#copy-link {
    border-radius: 0px;
    box-shadow: none;
}

.p5Canvas {
    position: absolute;
    bottom: -15px;
}

.halfcontainer {
    /* background: linear-gradient(to right, black 50%, white 0); */
    position: absolute;
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    width: 100vw;
    height: 100%;
    overflow: hidden;
    display: grid;
    place-items: center;
}

.controls {
position: absolute;
    z-index: 2;
    bottom: 5%;
    left: 25%;
    display: flex;
    flex-direction: row;
    justify-items: center;
    align-items: center;
    color: transparent;
    transform: translate(-50%, 10px);
}



.controls-2 {
    position: absolute;
    z-index: 2;
    bottom: 5%;
    right: 10%;
    display: flex;
    flex-direction: row;
    justify-items: center;
    align-items: center;
    color: black;
}


.player-2-join {
    position: absolute;
    right: 0%;
    top: 0%;
    z-index: 1;
    width: 50%;
    height: 100%;
    background: transparent;
    font-family: 'Times New Roman', Times, serif;
    color: black;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.player-1-join {
    position: absolute;
    left: 0%;
    top: 0%;
    width: 50%;
    height: 100%;
    background: transparent;
    font-family: 'Work Sans', sans-serif;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 123123;
    align-items: center;
}

.rematch-btn {
    font-size: 15px;
    letter-spacing: 0.5px;
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 1;
}


 @-webkit-keyframes gradientRoll {
    0%{background-position:18% 0%}
    50%{background-position:83% 100%}
    100%{background-position:18% 0%}
}
@-moz-keyframes gradientRoll {
    0%{background-position:18% 0%}
    50%{background-position:83% 100%}
    100%{background-position:18% 0%}
}
@keyframes gradientRoll {
    0%{background-position:18% 0%}
    50%{background-position:83% 100%}
    100%{background-position:18% 0%}
}


</style>