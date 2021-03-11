<template>
    <div style="min-width:33.33333vw" class="col d-flex flex-column justify-content-between black-bg stretch-height noisy"
        id="setup-filter">
        <div class="setup-col stretch-height">
            <div class="progress" :style="{opacity: stage==1?1:0}">
                <div v-if="stage==1" class="progress-bar bg-light" :aria-valuenow="Math.floor(Math.random())"
                    aria-valuemin="0" aria-valuemax="100" :style="{width: `${progress}%`}"><span
                        class="sr-only">20%</span></div>
            </div>
            <h1 class="text-center grey" style="letter-spacing: 0;">2</h1>
            <transition name="fade">

            <div v-if="state==='IDLE'" class="d-flex justify-content-center align-items-center jumper">
                <div class="grey-bg jump-symbol jump-forward"></div>
                <div class="grey-bg jump-symbol jump-backward"></div>
            </div>
            </transition>
    
            <transition name="fade2">

                <div v-if="state==='READY'" class="container d-flex flex-column justify-content-start content-height">
                    <h3 class="white">We are going to select quotes based on its similarity to:</h3>
                   <div class="d-flex flex-row justify-content-around align-content-start flex-wrap stretch-height">
                        <div @click="selectSentence(0)" class="d-flex justify-content-center justify-content-xl-center filter-btn"><img
                                class="persona-img" src="https://assets.codepen.io/5403278/AOC.png" width="100%">
                            <div class="form-check d-flex flex-column justify-content-start align-items-center persona">
                                <input class="form-check-input" type="radio" id="AOC-ideas" name="persona-option"><label
                                    class="form-check-label text-center" for="AOC-ideas">AOC Ideas</label></div>
                        </div>
                        <div @click="selectSentence(1)" class="d-flex justify-content-center justify-content-xl-center filter-btn"><img
                                class="persona-img" src="https://assets.codepen.io/5403278/Beyonce.png" width="100%">
                            <div class="form-check d-flex flex-column justify-content-start align-items-center persona">
                                <input class="form-check-input" type="radio" id="Beyonce-lyrics"
                                    name="persona-option"><label class="form-check-label text-center"
                                    for="Beyonce-lyrics">Beyoncé Lyrics</label></div>
                        </div>
                        <div @click="selectSentence(2)" class="d-flex justify-content-center justify-content-xl-center filter-btn"><img
                                class="persona-img" src="https://assets.codepen.io/5403278/Musk.png" width="100%">
                            <div class="form-check d-flex flex-column justify-content-start align-items-center persona">
                                <input class="form-check-input" type="radio" id="Elon-musk-tweets"
                                    name="persona-option"><label class="form-check-label text-center"
                                    for="Elon-musk-tweets">Elon Musk Tweets</label></div>
                        </div>
                        <div @click="selectSentence(3)" class="d-flex justify-content-center justify-content-xl-center filter-btn"><img
                                class="persona-img" src="https://assets.codepen.io/5403278/WHO.png" width="100%">
                            <div class="form-check d-flex flex-column justify-content-start align-items-center persona">
                                <input class="form-check-input" type="radio" id="WHO-reports"
                                    name="persona-option"><label class="form-check-label text-center"
                                    for="WHO-reports">WHO Reports</label></div>
                        </div>
                        <div @click="selectSentence(4)" class="d-flex justify-content-center filter-btn"><img class="persona-img"
                                src="https://assets.codepen.io/5403278/QAnon.png" width="100%">
                            <div class="form-check d-flex flex-column justify-content-start align-items-center persona">
                                <input class="form-check-input" type="radio" id="QAnon-conspiracies"
                                    name="persona-option"><label
                                    class="form-check-label text-center d-xl-flex justify-content-xl-center"
                                    for="QAnon-conspiracies">QAnon Conspiracies</label></div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import ConnectionHandler from './Game/ConnectionHandler';
export default {
        props: ["state", "error", "progress", "stage"],
        data() {
            return {
                images: [
                    "https://assets.codepen.io/5403278/AOC.png",
"https://assets.codepen.io/5403278/Beyonce.png",
"https://assets.codepen.io/5403278/Musk.png",
"https://assets.codepen.io/5403278/WHO.png",
"https://assets.codepen.io/5403278/QAnon.png",
                ]
            }
        },
        methods: {
            selectSentence(val) {
                ConnectionHandler.setFilter(this.images[val]);
                this.$emit('sentenceChoice', val);
            }
        }

    }
</script>

<style>

</style>