import Peer from 'peerjs'
import ControlHandler from './ControlHandler'
class ConnectionHandler {

    constructor() {
        this.name = 'Singleton';
        this.peer = null;
        this.playerNum = 0;
        this.peerId = null
        this.conn = null
        this.opponent = {
            peerId: null
        }
        this.demo = true

        this.opponentID = null

        this.ended = false
        this.connected = false
        this.speed = 20;
        this.width = 1000;
        this.height = 700;
        this.test = true;
        this.winner = -1;
        this.solo = false;


        this.sentences = [
            "This is a demo sentence a really long one with multiple words, this is much longer than I think it could be but who knows",
            "this is player two sentence, equally long with a decent word count"
        ]

        this.gameURLS = [
            '',
            ''
        ]

        this.playerData = [{}, {}]

    }


    setPlayerSentence(sentence) {

        console.log("Sync")
        console.log(this.sentences)
        this.sentences[this.playerNum] = sentence


    }

    setPlayerData(data) {
        this.playerData[this.playerNum] = data;
    }

    setFilter(filter) {
        this.playerData[this.playerNum].filter = filter;
    }

    sendSentence() {
        if (this.conn) {

            this.conn.send({
                id: "SENTENCE_SYNC",
                data: {
                    playerNum: this.playerNum,
                    sentence: this.sentences[this.playerNum],
                    playerData: this.playerData[this.playerNum]
                }
            })
        }
    }

    sendVictory(player) {
        this.winner = player;

        const event = new Event('end');
        window.dispatchEvent(event);
        if (this.conn) {

            this.conn.send({
                id: "GAME_OVER",
                player: player
            });
        }
    }


    // Player 2 sends this to player 1 - data and start
    sendStartMessage() {
        if (this.conn) {

            this.conn.send({
                id: "START_GAME",
                data: {
                    playerNum: this.playerNum,
                    sentence: this.sentences[this.playerNum],
                    playerData: this.playerData[this.playerNum]
                }
            })
        }

        console.log("P2->P1 syncing")


    }

    sendRematchMessage() {
        if (this.conn) {

            this.conn.send({
                id: "REMATCH"
            })
        }


    }

    begin() {
        if (this.conn) {

            this.conn.send({
                id: "BEGIN",
                urls: this.gameURLS,
            })
        }
        console.log(this.playerNum, "this player")
        this.connected = true


        this.conn.on('data', (data) => {
            this.handleData(data)
        })

        this.conn.on('close', () => {
            if (!this.ended) {
                // Attempt reconnection.


            }
            this.connected = false
        })
        this.peer.on('error', (err) => {
            console.log(err)
            this.connected = false
        })



    }

    initialize() {
        this.peer = new Peer('', {
            debug: 0
        })
        this.peer.on('open', (id) => {
            this.peerId = id
        })
        this.peer.on('error', (err) => {
            alert('' + err)
        })

    }

    start() {
        this.initialize()
        this.playerNum = 0
        this.opponent = 1


        this.peer.on('open', () => {

            // alert('Ask your friend/enemy to join using your peer ID: ' + this.peer.id)


        })
        this.peer.on('connection', (c) => {
            if (this.conn) {
                c.close()
                return
            }
            this.conn = c


            if (this.conn) {

                this.conn.send({
                    id: "LINK",
                    url: this.gameURLS[0]
                });
            }
            this.begin()
        })
    }

    join(id) {
        this.initialize()
        this.playerNum = 1
        this.opponent = 0


        this.opponentID = id


        this.peer.on('open', () => {


            // var destId = prompt("Opponent's this.peer ID:")
            this.conn = this.peer.connect(this.opponentID, {
                reliable: true
            })
            this.conn.on('open', () => {






                this.begin()
            })


        })
    }

    getLink() {
        if (this.peer) {

            return window.location.protocol + "//" + window.location.host + "/?code=" + this.peer.id + '&url=' + encodeURIComponent(this.gameURLS[0]);
        } else {
            return window.location.protocol + "//" + window.location.host
        }


    }

    setUrl(url) {
        this.gameURLS[this.playerNum] = url
    }


    // Player 1 sends this to player 2
    gameStart(data) {

        // Data received from p2
        this.processSentence(data);
        if (this.conn) {

            this.conn.send({
                id: "START_P_2",
                data: {
                    playerNum: this.playerNum,
                    sentence: this.sentences[this.playerNum],
                    playerData: this.playerData[this.playerNum]
                }
            });
        }


        // console
        console.log("P1 -> P2", this.sentences);
        // Starts game for p1
        const event = new Event('start');
        window.dispatchEvent(event);
    }

    player2Reset(data) {
        // Receiving p1\s data here
        this.processSentence(data);

        console.log("P1->P2 received", this.sentences);
        const event = new Event('reset');
        window.dispatchEvent(event);

        const event2 = new Event('start');
        window.dispatchEvent(event2);


    }

    handleData(data) {


        switch (data.id) {
            case "KEYS":
                this.processKeys(data);
                break;
            case "LINK":
                console.log(data);
                break;
            case "BEGIN":
                console.log("beginning")
                this.sendSentence()
                break;
            case "SENTENCE_SYNC":
                this.processSentence(data);
                break;
            case "START_GAME":
                this.gameStart(data)

                break;
            case "START_P_2":
                this.player2Reset(data)

                break;
            case "GAME_OVER":
                this.gameEnd(data)
                break;
            case "ACNOWLEDGE":
                this.acknowledge(data)

                break;

            case "REMATCH":
                const event = new Event('rematch');
                window.dispatchEvent(event);

                break;
            default:
                break;
        }
    }

    processBeginning(data) {
        if (this.playerNum == 1) {
            console.log(data.urls);
        }
    }


    gameEnd(data) {
        this.winner = data.player;

        const event = new Event('end');
        window.dispatchEvent(event);
        if (this.conn) {

            this.conn.send({
                id: "ACKNOWLEDGE"
            });
        }


    }
    acknowledge() {
        const event = new Event('end');
        window.dispatchEvent(event);
    }




    processKeys(data) {

        ControlHandler.opponentKeysDown = data.keys
    }

    processSentence(data) {

        this.sentences[data.data.playerNum] = data.data.sentence;
        this.playerData[data.data.playerNum] = data.data.playerData;
    }





    broadcastGameState(keys) {


        // if (this.test === false) {

        if (this.conn) {
            this.conn.send({
                id: "KEYS",
                player: this.playerNum,
                keys: keys
            })
        }

    }



    destroy() {
        this.conn = null;
        this.peer.destroy();
    }


    setOnePlayer() {
        this.solo = true;
        this.playerData[1] = this.playerData[0];
    }


}



const connection = new ConnectionHandler();


export default connection;