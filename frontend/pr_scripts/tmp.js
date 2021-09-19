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
        this.is_logged_in = false;
    
        this.add_event_listeners();

        let ws = new WebSocket('ws://127.0.0.1:8765/ws');

        let is_open = false;
        let curr_buffer;
        
        
        
        ws.onopen = function(event) {
            console.log("ws open");
            
            is_open = true;
            
            ws.send("init_data");
            
            // ws.send("curr_data");
            
        };        

        if (! WebSocketManager.is_instance_created) {
            WebSocketManager.is_instance_created = true;
            
            WebSocketManager.instance = new WebSocketManager();
        }
    }

    // get_init_data() {
    //     ws.send("init_data");
        
    //     return curr_buffer;
    // }
        
    add_event_listeners() {
    
        ws.addEventListener('open', () => {
            // Send a message to the WebSocket server
            console.log("open");
        
        });
        
        ws.addEventListener('message', event => {
            // The `event` object is a typical DOM event object, 
            // and the message data sent
            // by the server is stored in the `data` property
            console.log('Received:', event.data);
        
            curr_buffer = event.data;
            eventManagerInstance.emitEvent(event.data);
        
            console.log("data");
        });
        
        ws.addEventListener('close', () => {
            console.log("closed");
        });
        
    }

    send_data(data) {
        this._ws.send(data);
        // this._ws.send(JSON.stringify(msg));
    }
    
}

