<template>
  <div style="min-width:33.33333vw; " class="col d-flex flex-column justify-content-start grey-bg stretch-height noisy" id="setup-phrase">
            <div class="setup-col stretch-height">
              <div class="progress" :style="{opacity: stage==2?1:0}">
                    <div v-if="stage==2" class="progress-bar bg-light" :aria-valuenow="Math.floor(Math.random())" aria-valuemin="0" aria-valuemax="100"
                        :style="{width: `${progress}%`}"><span class="sr-only">20%</span></div>
                </div>
                <h1 class="text-center black" style="letter-spacing: 0;">3</h1>
                <div  v-if="state==='IDLE'" class="d-flex justify-content-center align-items-center jumper">
                    <div class="black-bg jump-symbol jump-forward"></div>
                    <div class="black-bg jump-symbol jump-backward"></div>
                </div>
                <div   v-if="state==='LOAD'"  class="d-flex justify-content-center align-items-center jumper">
                    <div class="round-btn spin">
                        <div class="d-flex refresh-symbol black-lines"></div>
                    </div>
                </div>
                <div   v-if="state==='READY'" style="overflow-y:scroll"  class="container d-flex flex-column justify-content-around content-height">
                    <h3 class="black">Choose your phrase fighter:</h3>
                    <div class="card-container">
                    <div v-for="sentence in sentences" class="card phrase-card">
                        <div class="card-body">
                            <div class="phrase-container">
                                <h1 class="quote-marks">“</h1>
                                
                                <div @click="moveToGame(sentence)"  class="form-check d-flex flex-row-reverse align-items-center phrase-option"><input
                                        class="form-check-input" type="radio"  id="phrase-option-0"
                                        name="phrase-option"><label class="form-check-label"
                                        for="phrase-option-0"><strong>{{sentence.sentence}}</strong></label></div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
       
                <div v-if="error" class="alert alert-dark d-flex flex-column align-items-center red-bg white" role="alert">
                    <span><strong>Darn it. We couldn't find any fighting phrases in the article you
                            chose.&nbsp;</strong></span><button @click="resetStage" class="btn btn-dark" type="submit"
                        style="margin-top: 10px;margin-bottom: 5px;">Try Another</button></div>
            </div>
        </div>
</template>

<script>
export default {
    props: ["state", "error", "progress", "stage", "sentences"],
    methods: {
        moveToGame(sentence) {
            this.$emit('moveToGame', sentence);
        },

        resetStage() {
            this.$emit('resetStage')
        }
    }
}
</script>

<style>

</style>