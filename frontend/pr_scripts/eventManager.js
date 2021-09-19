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

            EventManager.already_have = {};

            EventManager.ret_vals = {};
    
            class MessageEmitter extends EventEmitter {};

            EventManager.messageEmitter = new MessageEmitter();
     
            EventManager.messageEmitter.on(eventTypes.DEFAULT, (payload) => {
                // console.log('event occurred with payload', payload);

                payload = JSON.parse(payload);
             
                console.log("----------")

                // new implementation
                for (let [key, value] of Object.entries(payload)) {

                    console.log(key, " -> ", value)

                    let raw_key = key.substring(1, key.length -1).split(",")
                    console.log(raw_key)

                    if (value.startsWith("SingleValue")) {

                        value = value.split(".")[1]
                        console.log("val", value);

                    } else if (value.startsWith("FloatingValue")) {
                    
                        console.log("float")
                        console.log(typeof(value))
                        value = value.substring(0, value.length - 1).split("=")[1]
                        console.log("val", value);

                    }

                    EventManager.vals[key] = value;


                    console.log()
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
