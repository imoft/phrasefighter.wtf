<template>
    <div class="row no-gutters stretch-height" id="end-game">
        
        <div :style="{zIndex: winner == 0?123:-1}"  class="col d-flex flex-column justify-content-center align-items-center winner" id="player-black">
            <div class="d-flex flex-column align-items-center winner-animation">
                <div class="d-flex flex-row align-items-center" style="margin-left: -47px;">
                    <div class="d-flex round-btn grey-bg black-outline" style="margin-right: -21px;margin-bottom: -152px;">
                        <div class="d-flex face spin">
                            <div class="eyes"></div>
                            <div class="eyes"></div>
                        </div>
                    </div>
                    <div class="wiggle">
                        <div class="d-flex justify-content-center align-items-center white-bg black winner-sign" style="margin-bottom: 20px;">
                            <h1 class="text-center">Winner!</h1>
                        </div>
                    </div>
                </div>
                <h3 class="text-center black grey-bg tag-1" style="margin-left: 97px;margin-bottom: -15px;">With a phrase taken from</h3>
                <div class="jump-forward">
                    <div class="card d-flex justify-content-center align-items-center">
                        <div class="d-flex flex-column justify-content-center align-items-center align-content-center article-image"><img width="100%" :src="imagesrc1"></div>
                        <div class="card-body">
                            <h5 class="black">{{website1}}</h5>
                            <h3 class="card-title black">{{headline1}}</h3>
                        </div>
                    </div>
                </div>
                <div class="d-flex flex-row align-items-center" style="margin-top: -63px;">
                    <h3 class="text-center black grey-bg tag-2">based on its similarity to</h3>
                    <div class="round-btn red-bg spin persona"><img :src="filter1" width="90%"></div>
                </div>
            </div>
            <div class="d-flex flex-column justify-content-end loser-animation">
                <div class="d-flex round-btn red-bg black-outline">
                    <div class="d-flex face rotate">
                        <div class="eyes"></div>
                        <div class="eyes"></div>
                    </div>
                </div>
            </div>
        </div>
        <div :style="{zIndex: winner == 1?123:-1}"  class="col d-flex flex-column justify-content-center align-items-center winner" id="player-grey">
            <div class="d-flex flex-column align-items-center winner-animation">
                <div class="d-flex flex-row align-items-center" style="margin-left: -47px;">
                    <div class="d-flex round-btn red-bg black-outline" style="margin-right: -21px;margin-bottom: -152px;">
                        <div class="d-flex face spin">
                            <div class="eyes"></div>
                            <div class="eyes"></div>
                        </div>
                    </div>
                    <div class="wiggle">
                        <div class="d-flex justify-content-center align-items-center white-bg black winner-sign" style="margin-bottom: 20px;">
                            <h1 class="text-center">Winner!</h1>
                        </div>
                    </div>
                </div>
                <h3 class="text-center black grey-bg tag-1" style="margin-left: 97px;margin-bottom: -15px;">With a phrase taken from</h3>
                <div class="jump-forward">
                    <div class="card d-flex justify-content-center align-items-center">
                        <div class="d-flex flex-column justify-content-center align-items-center align-content-center article-image"><img width="100%" :src="imagesrc2"></div>
                        <div class="card-body">
                            <h5 class="black">{{website2}}</h5>
                            <h3 class="card-title black">{{headline2}}</h3>
                        </div>
                    </div>
                </div>
                <div class="d-flex flex-row align-items-center" style="margin-top: -63px;">
                    <h3 class="text-center black grey-bg tag-2">based on its similarity to</h3>
                    <div class="round-btn red-bg spin persona"><img :src="filter2" width="90%"></div>
                </div>
            </div>
            <div class="d-flex flex-column justify-content-end loser-animation">
                <div class="d-flex round-btn grey-bg black-outline">
                    <div class="d-flex face rotate">
                        <div class="eyes"></div>
                        <div class="eyes"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script>
import ConnectionHandler from './Game/ConnectionHandler';
import gsap from 'gsap'
export default {
    props: ["winner"],
    data() {
        return{
            website1: "",
            imagesrc1: "",
            headline1: "",
            filter1: "",
             website2: "",
            imagesrc2: "",
            headline2: "",
            filter2: ""
        }
    },

    watch:{
        winner: function (newVal, oldVal){
            // if(newVal == 0) {
            //     this.animateIn(0);
            // } 

            // if(newVal == 1) {
            //     this.animateIn(1);
            // }
        }
    },

    methods: {
        animateIn(player){

            if(player == 0){
                gsap.fromTo("#player-black", { x: -800, opacity:0}, {delay: 1.0, x:0, opacity: 1,ease: "expo.inOut", duration: 0.85});
                gsap.fromTo(".wiggle", {opacity: 0, x: -800}, {delay: 1.25, opacity: 1.0, x:0, ease: "expo.inOut", duration: 0.85});
                gsap.fromTo(".tag-1", {opacity: 0, x: -800}, {delay: 1.4, opacity: 1.0, x:0, ease: "expo.inOut", duration: 0.85});
                gsap.fromTo(".tag-2", {opacity: 0, x: -800}, {delay: 1.6, opacity: 1.0, x:0, ease: "expo.inOut", duration: 0.85});
                gsap.fromTo(".loser-animation", {opacity: 0.9, y: -800}, {delay: 1.6, opacity: 1.0, y:-50, ease: "bounce.out", duration: 1.5});

            } else {
                gsap.fromTo("#player-grey", { x: 800, opacity: 0}, {delay: 1.0, x:0, opacity:1, ease: "expo.inOut", duration: 0.85});
                gsap.fromTo(".wiggle", {opacity: 0, x: 800}, {delay: 1.25, opacity: 1.0, x:0, ease: "expo.inOut", duration: 0.85});
                gsap.fromTo(".tag-1", {opacity: 0, x: 800}, {delay: 1.4, opacity: 1.0, x:0, ease: "expo.inOut", duration: 0.85});
                gsap.fromTo(".tag-2", {opacity: 0, x: 800}, {delay: 1.6, opacity: 1.0, x:0, ease: "expo.inOut", duration: 0.85});
                gsap.fromTo(".loser-animation", {opacity: 0.9, y: -800}, {delay: 1.6, opacity: 1.0, y:-50, ease: "bounce.out", duration: 1.5});

            }
        }
    },

    mounted() {

        console.log("Mounted");
        let player1 = ConnectionHandler.playerData[0]

        this.website1 = player1.website;
        this.imagesrc1 = player1.img;
        this.headline1 = player1.headline;
        this.filter1 = player1.filter;

            let player2 = ConnectionHandler.playerData[1]

        this.website2 = player2.website;
        this.imagesrc2 = player2.img;
        this.headline2 = player2.headline;
        this.filter2 = player2.filter;
        console.log(player1);

        setTimeout(()=>{
   this.animateIn(this.winner);
        },1000);
                


    }
}
</script>

<style>
#end-game {
    margin-top:10%;
    max-height: 90%;
    overflow: hidden;
}
#player-black {
    z-index: 0;
    opacity: 0;
}
#player-grey {
    z-index: 0;
    opacity: 0;
}

.wiggle {
    opacity: 0;
    
}


</style>