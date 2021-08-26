const WebSocket = require('ws');

const eventManager = require('./eventManager');
let eventManagerInstance = new eventManager().getInstance();

// const 
// import { WebSocketServer } from 'ws';

// const wss = new WebSocketServer({ port: 8080 });

// wss.on('connection', function connection(ws) {
//   ws.on('message', function incoming(message) {
//     console.log('received: %s', message);
//   });

//   ws.send('something');
// });


module.exports = class WebSocketManager {

    getInstance() {
        return WebSocketManager.instance;
    }

    constructor() {
        this.is_logged_in = false;
    
        this._ws = new WebSocket('ws://127.0.0.1:23023/ws');

        this.add_event_listeners();

        if (! WebSocketManager.is_instance_created) {
            WebSocketManager.is_instance_created = true;
            
            WebSocketManager.instance = new WebSocketManager();
        }
    }
    
    add_event_listeners() {
        this._ws.addEventListener('open', () => {
            console.log("open");
            console.log();
        });
        
        this._ws.addEventListener('close', () => {
            console.log("closed");
        });
    
        this._ws.addEventListener('message', evt => {
            console.log("msg");
        
            let msg = JSON.parse(evt.data);
        
            if (!this.is_logged_in) {
                this.login_driver(msg);
            } else if (msg.type == "DATA") {
        
                msg.payload.forEach(element => {
        
                    // console.log("elem", element);
        
                    if (element.op == "add") {
                        console.log("init vals");
                    
                        eventManagerInstance.emitEvent(element);

                    } else if (element.op == "replace") {
                        console.log("update vals");

                        eventManagerInstance.emitEvent(element);
                    
                    } else {
                        console.log("other");
                    }
        
                });
        
            } else {
                console.log("other msg");
            }
        
            // console.log();
        });
    }

    login_driver(pl) {
    
        if (pl.type == "DATA" &&
            pl.payload[0].op == "replace" &&
            pl.payload[0].path == "" &&
            JSON.stringify(pl.payload[0].value) === "{}") {
    
            console.log("init msg")
    
            let msg = {
                "type": "MESSAGE",
                "payload": {
                    "type": "login",
                    "name": "user",
                    "password": "d74ff0ee8da3b9806b18c877dbf29bbde50b5bd8e4dad7a3a725000feb82e8f1"
                }
            };
    
            this._ws.send(JSON.stringify(msg));
    
            this.is_logged_in = true;
        }
    
    }    
    
}
