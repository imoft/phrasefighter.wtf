<template>
  <div id="app" class="red-bg">
    <transition :name="transitionName" mode="out-in">
      <router-view v-if="!isMobile" />
    </transition>


    <div style="z-index:123; border: none" v-if="isMobile" class="modal  d-flex flex-column justify-content-center black-bg" role="dialog"
      tabindex="-1" id="phone-message">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-body black-bg white-bg">
            <h1 class="text-center">So sorry</h1>
            <h3 class="text-center">Our game only works with mouse and keyboard.</h3>
          </div>
          <div class="modal-footer d-flex flex-column black-bg white" style="border-color: rgba(255,255,255,0);"><button
              class="btn btn-secondary red-bg" @click="copyLink" type="button" style="margin-bottom: 40px;z-index:123123">{{copyText}}</button><small class="grey">This game was made by</small><a href="https://imaginationofthings.com/"
              target="_blank">Imagination of Things</a></div>
        </div>
      </div>
    </div>
    
  </div>
</template>


<script>
const DEFAULT_TRANSITION = 'fade'
export default {
  name: 'App',
  data() {
    return {
      prevHeight: 0,
      copyText: "Copy link to game",
      isMobile: false,
      transitionName: DEFAULT_TRANSITION
    };
  },

  mounted() {

    if(window.innerWidth < 1000) {
      this.isMobile = true;
    }

    

  },
  created() {
   this.$router.beforeEach((to, from, next) => {
     let transitionName = to.meta.transitionName || from.meta.transitionName;
     if (transitionName === 'slide') {
       const toDepth = to.path.length;
       const fromDepth = from.path.length;
       transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
       console.log(to.path.length, from.path.length)
     }
     this.transitionName = transitionName || DEFAULT_TRANSITION;
     next();
   });
 },
   methods: {
  beforeLeave(element) {
      this.prevHeight = getComputedStyle(element).height;
    },
    enter(element) {
      const { height } = getComputedStyle(element);

      element.style.height = this.prevHeight;

      setTimeout(() => {
        element.style.height = height;
      });
    },
    afterEnter(element) {
      element.style.height = 'auto';
    },

    copyLink() {
        if (!navigator.clipboard) {
                // Clipboard API not available
                return
            }
                            this.copyText = "Copied!"

            navigator.clipboard.writeText(window.location.protocol + "//" + window.location.host)
                .then(() => {
                    // Success!
                this.copyText = "Copied!"
                setTimeout(()=>{
                    this.copyText = "Copy to clipboard"
                }, 1000)



                })
                .catch(err => {
                    console.log('Something went wrong', err);
                });

    }
  },
  
}
</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@600&display=swap');
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.1s;
  transition-property: height,opacity;
  transition-timing-function: ease;
  overflow: hidden;
}


.fade-enter,
.fade-leave-active {
  opacity: 0
}
.fade2-enter-active,
.fade2-leave-active {
  transition-duration: 0.2s;
  transition-property: height,opacity;
  transition-timing-function: ease;
  overflow: hidden;
  transition-delay: 0.3s;
}


.fade2-enter,
.fade2-leave-active {
  opacity: 0
}


.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 0.5s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(50%, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-50%, 0);
}


#app {
  font-family: 'Work Sans', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  width: 100%;
  height: 100%;
  overflow: hidden;
}



#app:after {
  animation: grain 4s steps(10) infinite;
  background-image: url(./assets/grain.png);
  content: "";
  height: 300%;
  left: -50%;
  pointer-events: none;
  filter: brightness(5);
  opacity: 1.0;
  z-index: 0;
  position: fixed;
  top: -110%;
  width: 300%;
}

@keyframes grain {
  0%, 100% { transform:translate(0, 0) }
  10% { transform:translate(-5%, -10%) }
  20% { transform:translate(-15%, 5%) }
  30% { transform:translate(7%, -25%) }
  40% { transform:translate(-5%, 25%) }
  50% { transform:translate(-15%, 10%) }
  60% { transform:translate(15%, 0%) }
  70% { transform:translate(0%, 15%) }
  80% { transform:translate(3%, 35%) }
  90% { transform:translate(-10%, 10%) }
}



.lds-dual-ring {
  display: inline-block;
  width: 40px;
  height: 40px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 34px;
  height: 34px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #fff;
  border-color: #fff transparent #fff transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
