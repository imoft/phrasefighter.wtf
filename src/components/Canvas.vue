
<template>
    <div id="test-container">
    </div>
</template>

<script>
import P5 from 'p5' // Package from npm
// import debounce from './Game/utils'
// import gsap from 'gs/ap'
export default {
    name: 'Canvas',


    data() {
        return {
            p5canvas: null
        }
    },
    mounted() {

        const script = p5 => {

            let x = 0
            let y = 0

            let ox = 0
            let oy = 0

            let pSize = 40;
            let oSize = 40;
            // These are your typical setup() and draw() methods
            p5.setup = () => {
                let canvas = p5.createCanvas(window.innerWidth, 500)
                canvas.parent('test-container')

                window.addEventListener('pShoot', () => { 
                  pSize = 100;
                   setTimeout(()=>{
                    oSize = 40;
                  },100)
                 }, false);
                window.addEventListener('oShoot', () => { 
                  oSize = 100;

                  setTimeout(()=>{
                    oSize = 40;
                  },100)
                 }, false);

            };
            p5.draw = () => {
                // if (p5.frameCount % 1 === 0) {
                updatePosition()
                // }

                p5.clear();
                p5.fill(255, 0, 0);
                p5.ellipse(x, y, pSize, pSize);

                p5.fill(0, 0, 255);
                p5.ellipse(ox, oy, oSize, oSize);
            };

         


        }
        // Attach the canvas to the div
        this.p5canvas = new P5(script, 'canvas');
    },
}
</script>

<style>
#test-container {
    width: 100%;
    height: 100%;
}
</style>