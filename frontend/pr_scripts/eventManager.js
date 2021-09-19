const EventEmitter = require('events');
const { raw } = require('express');

const eventTypes = {
    // new vals
    DEFAULT: 'default',
}

module.exports = class EventManager {

    getInstance() {
        return EventManager.instance;
    }

    getValSingle(val) {
        return EventManager.vals[val];
    }

    getVals() {
        return EventManager.vals;
    }

    constructor() {
    
        if (! EventManager.is_instance_created) {
            EventManager.is_instance_created = true;
            EventManager.instance = new EventManager();

            EventManager.vals = {};

            class MessageEmitter extends EventEmitter {};

            EventManager.messageEmitter = new MessageEmitter();
     
            EventManager.messageEmitter.on(eventTypes.DEFAULT, (payload) => {
                // console.log('event occurred with payload', payload);

                payload = JSON.parse(payload);
             
                // console.log("----------")

                // new implementation
                for (let [key, value] of Object.entries(payload)) {

                    console.log(key, " -> ", value);

                    let raw_key = key.substring(1, key.length -1).split(",");
                    
                    raw_key = raw_key.map((i) => Number(i));

                    if (value.startsWith("SingleValue")) {

                        value = value.split(".")[1];

                    } else if (value.startsWith("FloatingValue")) {
                    
                        value = value.substring(0, value.length - 1).split("=")[1];

                    }

                    // console.log(raw_key);
                    // console.log("val", value);

                    EventManager.vals[raw_key[0] + ";" + raw_key[1]] = value;

                    // console.log();
                }

                // old implementation
                // if (payload.value.constructor == Object) {

                //     for (const [key, value] of Object.entries(payload.value)) {

                //         EventManager.vals[key] = value;
                 
                //     }

                // } else {
                //     EventManager.vals[payload.path] = payload.value;
                // }

                // console.log(EventManager.vals);

            });

        }
    }

    emitEvent(payload) {
        EventManager.messageEmitter.emit(eventTypes.DEFAULT, payload);
    }
    
}
