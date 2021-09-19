/**
 * websocket drivers
 * 
 * establishes connection with backend
 * logs messages in console depending on the type (open, closed, message, other msg)
 * 
 * sends updated vals to @eventManagerInstance
 * 
 * 
 */
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
    
        this._ws = new WebSocket('ws://127.0.0.1:8765/ws');

        this.add_event_listeners();

        if (! WebSocketManager.is_instance_created) {
            WebSocketManager.is_instance_created = true;
            
            WebSocketManager.instance = new WebSocketManager();
        }
    }
    
    add_event_listeners() {
        this._ws.addEventListener('open', () => {
            console.log("open");
            // console.log();
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
                        // console.log("init vals");
                    
                        eventManagerInstance.emitEvent(element);

                    } else if (element.op == "replace") {
                        // console.log("update vals");

                        eventManagerInstance.emitEvent(element);
                    
                    } else {
                        // console.log("other");
                    }
        
                });
        
            } else {
                console.log("other msg");

                msg.forEach(element => {
        
                   console.log(element);
                });
            }
        
            // console.log();
        });
    }

    send_data(data) {
        this._ws.send(data);
        // this._ws.send(JSON.stringify(msg));
    }
    
}
