<template>
    <div class="red-bg">
        <div class="row no-gutters d-flex flex-row justify-content-xl-start full-height" id="game-setup">
            <div class="col d-flex flex-column justify-content-center stretch-height" id="home-left">
                <h5 class="white" style="margin: 20px;">Desktop Only</h5>
                <div class="d-flex flex-column justify-content-center align-items-center stretch-height">
                                
                    <div class="logo">
                        
                        
                    <div class="word fighter">
                    <h2>p</h2>
                    <h2>h</h2>
                    <h2>r</h2>
                    <h2>a</h2>
                    <h2>s</h2>
                    <h2>e</h2>
                    </div>

                    <div class="fighter">
                    <h1>f</h1><h1>i</h1><h1>g</h1><h1>h</h1><h1>t</h1><h1>e</h1><h1>r</h1>
                    </div>
                    
                    
                    </div>
  

                </div>
            </div>
            <div class="col d-flex flex-column justify-content-center align-items-center stretch-height"
                id="home-right"><button class="btn btn-info" type="button">?</button>
                <div v-if="isPlayer2" id="challenged">
                    <h3 class="text-uppercase red" style="margin: 40px;"><strong>You have been challenged!</strong><br>
                    </h3>
                    <h3 class="black" style="margin: 40px;"><strong>Join your friend in a fight using words found on the
                            internet, filtered by some great and disturbing voices of our time.</strong><br></h3>
                </div>
                <h3 v-if="!isPlayer2" id="challenger" class="black" style="margin: 40px;"><strong>Challenge a friend to
                        a fight using
                        words found on the internet, filtered by some great and disturbing voices of our
                        time.</strong><br></h3>

                <button v-if="isPlayer2 && !disabledJoin" @click="player2Join" class="btn btn-primary red-bg"
                    type="button">&nbsp;Accept</button>
                <button  v-if="!isPlayer2 && !disabled" @click="goToSetup" class="btn btn-primary red-bg"
                    type="button">&nbsp;PlaY</button>
                     <div v-if="disabled || disabledJoin" class="round-btn red-bg">
                <div class="d-flex refresh-symbol spin"></div>
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
        <section class="d-flex justify-content-center align-items-center align-content-center noisy">
            <video width="560" height="315" autoplay="autoplay" muted="muted" loop=""
                poster="../assets/background_1.jpg">
                <source src="https://imaginationofthings.com/gamebg.mp4" type="video/mp4">
            </video>
            <!-- <div class="overlay" style=></div> -->
        </section>


        <!-- <div class="col d-flex flex-column justify-content-center black-bg stretch-height" id="home-left">
            <h4 class="white" style="margin: 20px;">Desktop Only</h4>
            <div class="d-flex flex-column justify-content-center align-items-center stretch-height">
                <h1 class="text-center">PHRASE</h1>
                <h2 class="text-center" style="margin-bottom: 100px;">fighter</h2>
            </div>
        </div>
        <div class="col d-flex flex-column justify-content-center align-items-center grey-bg stretch-height" id="home-right">
            <h3 class="black" style="margin: 40px;">Challenge a friend to a fight using words found on the internet, filtered by some great and disturbing voices of our time.</h3>

            <div class="row" style="height: 25%; min-height:25%">
            <loader v-if="disabled"></loader>

            <div v-else @click="goToSetup" class="round-btn red-bg spin">
                <h3>PLAY</h3>
            </div>
            </div>
            
        </div>


         <div v-b-toggle.sidebar-1 class="info">
        </div>

 -->
    </div>
</template>

<script>
// @ is an alias to /src
import ConnectionHandler from '../components/Game/ConnectionHandler'
import Loader from '../components/Loader'
import {Howl, Howler} from 'howler'
import audiofile from '../assets/audio/pew.mp3'
import gsap from 'gsap'
export default {
    name: 'Home',
    components: {
        'loader': Loader

    },
    data() {
        return {
            connection: null,
            opponent: false,
            code: null,
            disabled: false,
            isPlayer2: false,
            interval: null,
            animCount: 0,
            disabledJoin: false,

        }
    },

    created() {


    },
    beforeDestroy() {
        window.clearInterval(this.interval);
    },
    mounted() {
        var sound = new Howl({
            src: [audiofile],
            autoplay: true,
            loop: false,
            volume: 0.0,
            onend: function () {
    
            }
        });




        if (this.$route.query.code) {

            console.log("joining")
            this.isPlayer2 = true;
            this.code = this.$route.query.code
            



        }

        this.interval = setInterval(() => {
            this.animate()
            this.animCount += 1;
        }, 3000);









    },

    methods: {
        getRand(min, max) {
            return Math.random() * (max - min) + min;
        },
        animate() {

            if (this.animCount <= 3) {

                gsap.to("h1, h2", 2.5, {
                        x:  ()=> {
                            return this.getRand(-100, 100)
                        },
                        y:  ()=> {
                            return this.getRand(-100, 100)
                        },
                        rotation:  ()=> {
                            return this.getRand(-5, 5)
                        },
                        duration:  ()=> {
                            return this.getRand(1, 3)
                        },
                        transformOrigin: '50% 50%',
                        ease: "cubic.inOut",
                    }


                );
            } else {

                gsap.to("h1, h2", 1.5, {
                        x:  ()=> {
                            return 0
                        },
                        y:  ()=> {
                            return 0
                        },
                        rotation:  ()=> {
                            return 0
                        },
                        duration:  ()=> {
                            return 0
                        },
                        transformOrigin: '50% 50%',
                        ease: "cubic.inOut",
                    }


                );
                this.animCount = 0;
            }



        },
        goToSetup() {
            if (!this.disabled) {
                this.disabled = true;
                console.log(ConnectionHandler)
                ConnectionHandler.start()
                setTimeout(() => {
                    this.disabled = false;
                    this.$router.push({
                        path: 'setup'
                    })
                }, 1500)
            }
        },


        player2Join() {
            if (this.$route.query.url) {
                console.log(this.$route.query.url)
                ConnectionHandler.gameURLS[0] = this.$route.query.url
            }

            if(!this.disabledJoin) {
                this.disabledJoin = true;
            }

            ConnectionHandler.join(this.code)

            this.opponent = true;
            ConnectionHandler.playerNum = 1;

            setTimeout(() => {
                this.disabledJoin = false;

                this.$router.push({
                    path: 'setup'
                })
            }, 2000)
        },




    }

}
</script>

<style>
.logo{
  display:flex;
  flex-direction:column;
  justify-content:center;
}

.fighter {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.word {

}

</style>
