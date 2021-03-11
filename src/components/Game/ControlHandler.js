class ControlHandler {


    constructor() {
        this.keysDown = []
        this.opponentKeysDown = []

    }


    update() {

        document.onkeydown = (e)=>{ this.onPress(e) };
        document.onkeyup =(e)=>{ this.onRelease(e) };
        

    }


    onPress(e) {
        e = e || window.event;
        // use e.keyCode
        if (this.keysDown.indexOf(e.keyCode) < 0) {
            this.keysDown.push(e.keyCode)
            // //console.log()
        }
    }

    onRelease(e) {
        e = e || window.event;
        let index = this.keysDown.indexOf(e.keyCode)
        if (index >= 0) {
            this.keysDown.splice(index, 1)

        }
    }


  
    



}

const controls = new ControlHandler();

export default controls;