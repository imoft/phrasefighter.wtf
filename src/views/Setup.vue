<template>
    <div class="row no-gutters d-flex flex-row justify-content-xl-start full-height" id="game-setup">
        <setup-1 @stageChange="handleStageChange" @useOpponentLink="useOpponentLink" @updateURL="updateURL" :state="pageStates[0]" :error="error" :progress="progress" :stage="stage" :isPlayer2="isPlayer2"></setup-1>
        <setup-2 @sentenceChoice="selectSentence($event)" :state="pageStates[1]" :progress="progress" :stage="stage"></setup-2>
        <setup-3 :loading="loading" :state="pageStates[2]" :error="error" :sentences="sentences" @moveToGame="moveToGame" @resetStage="stage=0;error=false" :progress="progress" :stage="stage"></setup-3>
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
import axios from 'axios'
import Loader from '../components/Loader'
import ConnectionHandler from '../components/Game/ConnectionHandler'

import SetupPage1 from '../components/SetupPage1'
import SetupPage2 from '../components/SetupPage2'
import SetupPage3 from '../components/SetupPage3'

export default {
    components: {
        'loader': Loader,
        'setup-1': SetupPage1,
        'setup-2': SetupPage2,
        'setup-3': SetupPage3

    },
   
 data() {
        return {
            pageStates: ["READY", "IDLE", "IDLE"],
            url: '',
            loading: false,
            loadingSentence: false,
            isPlayer2: false,
            error: false,
            interval: null,
            stage: 0,
            progress: 0,
            imagesrc: "",
            noSentences: false,
            headline: "",
            description: "",
            showInput: true,
            selectedFilter: null,
            filters: [
                { title: "AOC Ideas", text: "Healthcare and free tuition for all. Housing as a human right. Tax the rich. We need to redistribute money from the rich to the poor. We need a green new deal. Our system is fundamentally broken. Inequality in this country is immoral. Working-class America deserves a living wage." },

                { title: "Beyoncé's Lyrics", text: "I can see the stars all the way from here. Can't you see the glow on the window pane. I can feel the sun whenever you're near. This my shit, bow down, bitches. Okay, ladies, now let's get in formation, I slay. Aye, put two fingers in the sky if you want it. I am the dragon breathing fire." },
                               { title: "Elon Musk tweets", text: "The rumor that I'm building a spaceship to get back to my home planet Mars is totally untrue. We are literally a brain in a vat. The vat is your skull. Everything you think is real is an electrical signal. Feels so real though. Tesla blows. Nuke Mars!" },
                { title: "WHO reports", text: "Globally, million new cases were reported in the past week, a decline of 6% from last week, and the number of new deaths has climbed to a record high at, increase from last week. When considered to potentially having different epidemiological, immunological or pathogenic properties, variants are reported to WHO and further investigated by national authorities and scientists. Covid-19. Coronavirus." },

               { title: "QAnon Conspiracy Theories", text: "Pizzagate is real, stop the child trafficking ring. Hollywood Liberal Elite Harvesting Blood for a drug called adrenochrome. This pandemic is a Chinese bioweapon. Bill Gates is planning it as well. The deep state is behind it. Ask the Q." },
            ],

            sentences: [],
            selectedSentence: null,
        }
    },

    watch: {
        stage: function() {
            if(this.stage == 0){
                this.pageStates = ["READY", "IDLE", "IDLE"];

            } else if (this.stage == 1) {
                this.pageStates = ["READY", "READY", "IDLE"];
            } else if (this.stage == 2) {
                this.pageStates = ["READY", "READY", "LOAD"];
            }
        }
    },
 
    mounted() {

        if(ConnectionHandler.playerNum == 1){
            this.isPlayer2 = true;
        } else {
            this.isPlayer2 = false
        }
        this.interval = setInterval(()=>{
            if(this.progress<100){
                this.stepProgressForward()
            }


        },1000)

        if(ConnectionHandler.peer == null){
            this.$router.push({path: "/"});
        }
        
       
        
        
        
    },

    beforeDestroy() {
        window.clearInterval(this.interval);
        
    },
    methods: {

        updateURL(url){
            this.url = url;
            console.log(this.url);
        },

        useOpponentLink() {
            console.log("used", ConnectionHandler.gameURLS[0])
            if (ConnectionHandler.gameURLS[0] != '') {
                this.url = ConnectionHandler.gameURLS[0];
            }
        },

        handleStageChange(data){
            console.log(data)
            this.stage = data;
        },
        selectSentence(num){
            console.log(num);
            this.selectedSentence = this.filters[num]
            console.log(this.selectedSentence);
            
            this.getSentences(this.selectedSentence.text)
        },
        stepProgressForward() {
            this.progress = this.progress>100?this.progress:this.progress+2.5;  
        }, 
        stepProgressBack() {
            this.progress = this.progress<=10?this.progress:this.progress-2.5;  

        },
        handlePaste(evt) {
            setTimeout(()=>{
      console.log('on paste', evt.target.value)
                this.submit()
            },1000)

        },

        moveToGame(sentence) {

            console.log(sentence.sentence);
            ConnectionHandler.setPlayerSentence(sentence.sentence)
                        this.$router.push({path:"/gamecanvas"});

           
        },
     

        getSentences(text) {
            this.loading = true;
            this.stage = 2;
            axios.get('https://phrasefighter-idvgffrwca-ez.a.run.app', {
                    params: {
                        url: this.url,
                        query: text
                    }
                })
                .then((response) => {
                    console.log(response.data);
                
                    this.pageStates[2] = "READY"
                    ConnectionHandler.sentences[1] = response.data.values[4].sentence;
                    this.sentences = response.data.values.slice(0,3);
                    if(this.sentences.length < 3) {
                        this.error = true;
                        this.sentences = null
                    } else {
                        this.loading = false;
                        this.error = false;
                    }
                })
                .catch((error) => {
                    console.log(error);
                    this.loading = false;
                    this.error = true;
                    this.stage = 0;
                    this.url = ""

                })
                .then(() => {
                    // always executed
                });
        }

    }
}
</script>

<style>
.anim-flex {
     

    transition: flex-grow 500ms ease-in;
}

.internal-col {
    transition: opacity 750ms ease-in ;
    min-width: 33vw;
}

.form-check-input {
    z-index: 2000;
}

.persona-img {
    z-index: 2001;
    pointer-events: none;
}

.card-img-top {
    object-fit: cover;
    max-height: 200px;
}
</style>