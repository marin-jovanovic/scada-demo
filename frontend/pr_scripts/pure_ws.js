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

// -----------------------------------------------------------------------

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
        if (! WebSocketManager.is_instance_created) {
            WebSocketManager.is_instance_created = true;
            
            WebSocketManager.instance = new WebSocketManager();
            return;
        }
        console.log("creating new ws manager")

        this.is_logged_in = false;

        this.ws = new WebSocket('ws://127.0.0.1:8765/ws');
        console.log("created new ws")

        this.add_event_listeners();
        console.log("added event listeners")

        this.is_open = false;

        this.ws.onopen = function(event) {
            console.log("on open");

            this.send("init_data");
        };
        console.log("ws init done");

        // this.ws.onopen = function(event) {
            
        // };        

    }

    on_open() {
        console.log("ws open");
            
        this.is_open = true;
        
        this.ws.send("init_data");            
        // ws.send("curr_data");
    }

    add_event_listeners() {
    
        this.ws.addEventListener('open', () => {
            console.log("open");        
        });
        
        this.ws.addEventListener('message', event => {
            // The `event` object is a typical DOM event object, 
            // and the message data sent
            // by the server is stored in the `data` property
           
            // console.log('Received:', event.data);
        
            eventManagerInstance.emitEvent(event.data);
        
            console.log("data");
        });
        
        this.ws.addEventListener('close', () => {
            console.log("closed");
        });
        
    }

    send_data(data) {
        this.ws.send(data);
        // this._ws.send(JSON.stringify(msg));
    }
    
}

