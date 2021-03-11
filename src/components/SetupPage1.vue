<template>
         <div class="col-4 d-flex flex-column justify-content-between red-bg stretch-height" id="setup-link">
            <div class="setup-col stretch-height">
                  <div class="progress" :style="{opacity: stage==0?1:0}">
                    <div v-if="stage==0" class="progress-bar bg-light" :aria-valuenow="Math.floor(Math.random())" aria-valuemin="0" aria-valuemax="100"
                        :style="{width: `${progress}%`}"><span class="sr-only">20%</span></div>
                </div>
                <h1 class="text-center" style="letter-spacing: 0;">1</h1>
                <div v-if="state==='IDLE'" class="d-flex justify-content-center align-items-center jumper">
                    <div class="white-bg jump-symbol jump-forward"></div>
                    <div class="white-bg jump-symbol jump-backward"></div>
                </div>
                <div v-if="state==='LOAD'" class="d-flex justify-content-center align-items-center jumper">
                    <div class="round-btn spin">
                        <div class="d-flex refresh-symbol"></div>
                    </div>
                </div>
                <div v-if="state==='READY'" class="container d-flex flex-column justify-content-around">
                    <h3 class="black">Let’s pick a phrase to start the fight. Where should we get it from?</h3>
                    <div class="card d-flex justify-content-center align-items-center">
                        <div  v-if="showCard"
                            class="d-flex flex-column justify-content-center align-items-center align-content-center article-image">
                            <img width="100%" style="object-fit:cover" :src="imagesrc">
                        </div>
                        <div class="card-body">
                            <h5 v-if="showCard" class="black">{{website}}</h5>
                            <h3  v-if="showCard" class="card-title black">{{headline}}</h3>
                            <div v-if="loading" class="d-flex justify-content-center align-items-center">
                                <div class="round-btn spin">
                                    <div class="d-flex refresh-symbol grey-lines"></div>
                                </div>
                            </div>
                            <input v-model="url" v-if="!showCard" class="form-control link-input" type="url"
                                    placeholder="Paste a link here"><small v-if="!showCard"  class="form-text text-muted">Your phrase will
                                    be a quote taken from this link. An article, essay, etc.</small>
                            <div v-if="linkError" class="alert alert-info" role="alert"><span><strong>Hmm... That site won't work with
                                        our game. Try an article from a site like&nbsp;</strong><a
                                        class="alert-link red" href="https://www.theguardian.com" target="_blank">The
                                        Guardian</a><strong>&nbsp;or&nbsp;</strong><a class="alert-link red"
                                        href="https://medium.com/"
                                        target="_blank">Medium</a><strong>&nbsp;.</strong></span></div>
                            <div class="d-flex flex-column justify-content-center align-items-center"
                                style="margin-top: 10px;">
                                <div v-if="showCard" @click="reset"
                                    class="d-flex flex-column justify-content-center align-items-center align-content-center close-btn">
                                </div>
                                <button v-if="!showCard && isPlayer2" class="btn btn-link" @click="useOpponentLink" type="button">Use your opponent's
                                    link&nbsp;<strong>►</strong></button>
                                    
                                    <button v-if="!showCard"  @click="submit" :disabled="url.length==0" class="btn btn-dark"
                                    type="submit">Submit Link</button>
                            </div>
                        </div>
                    </div>
                </div>
              
            </div>
        </div>
</template>

<script>
import axios from 'axios'

import ConnectionHandler from '../components/Game/ConnectionHandler'

export default {
    props: ["state", "error", "progress", "stage", "isPlayer2"],

    data() {
        return {
            url: '',
            loadingSentence: false,
            imagesrc: "",
            website: "",
            headline: "",
            description: "",
            showCard: false,
            loading: false,
            linkError: false,
        }
    },

    watch: {
        url: function() {
            this.$emit('updateURL', this.url)
        },

        error: function() {
            if(this.error) {
                this.showCard = false;
                this.url = ""
            }
        }
    },

    methods: {

        useOpponentLink() {
            this.$emit('useOpponentLink');
            this.url = ConnectionHandler.gameURLS[0];
            this.submit();
        },
        submit() {
            if(this.url.includes("pdf")){
                this.linkError = true;
                
            } else {
            this.loading = true;
            var sourceString = this.url.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];
            console.log(sourceString);

            this.website = sourceString;
            
            this.linkError = false;
            console.log(this.url)
            ConnectionHandler.setUrl(this.url);
            this.loadingSentence = true;
            axios.get('https://grabity-idvgffrwca-ez.a.run.app/', {
                    params: {
                        url: this.url
                    }
                })
                .then((response) => {
                    this.showCard = true;
                    console.log(response.data);
                    let data = response.data;
                    this.imagesrc = data.image;
                    this.headline = data.title ? data.title : "";
                    this.description = data.description ? data.description : "";
                    this.showInput = !this.showInput
                    this.loadingSentence = false;

                                ConnectionHandler.setPlayerData({url: this.url, website: this.website, img: this.imagesrc, headline:this.headline })


                    this.$emit('stageChange', 1);

                })
                .catch((error) => {
                    console.log(error);
                    this.linkError = true;
                    this.$emit('stageChange', 0);
                })
                .then(() => {
                    // always executed
                                                    ConnectionHandler.setPlayerData({url: this.url, website: this.website, img: this.imagesrc, headline:this.headline })

                    this.loading = false;
                });
            }
        },

        reset() {
            this.headline = ""
            this.website = ""
            this.imagesrc = ""
            this.showCard = false;
            this.url = ""
                                this.$emit('stageChange', 0);

        }
    }
}
</script>

<style>

</style>