const WebSocket = require('ws');

const eventManager = require('./eventManager');
let eventManagerInstance = new eventManager().getInstance();


ws = new WebSocket('ws://127.0.0.1:8765/ws');


ws.addEventListener('open', () => {
    // Send a message to the WebSocket server
    console.log("open");
    ws.send('init_data');

});

ws.addEventListener('message', event => {
    // The `event` object is a typical DOM event object, and the message data sent
    // by the server is stored in the `data` property
    console.log('Received:', event.data);
});


// ws.addEventListener('close', () => {
//     console.log("closed");
// });

// ws.addEventListener('message', evt => {
//     console.log("msg");

//     let msg = JSON.parse(evt.data);

//     if (msg.type == "DATA") {

//         msg.payload.forEach(element => {

//             // console.log("elem", element);

//             if (element.op == "add") {
//                 // console.log("init vals");
            
//                 eventManagerInstance.emitEvent(element);

//             } else if (element.op == "replace") {
//                 // console.log("update vals");

//                 eventManagerInstance.emitEvent(element);
            
//             } else {
//                 // console.log("other");
//             }

//         });

//     } else {
//         console.log("other msg");

//         msg.forEach(element => {

//         console.log(element);
//         });
//     }

//     // console.log();
// });



// function send_data(data) {
//         ws.send(data);
//         // this._ws.send(JSON.stringify(msg));
// }

// send_data("jlkjlk")
