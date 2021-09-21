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

    getHistoricalVals(asdu, io) {

        console.log("getting")

        console.log(EventManager.historic_vals)

        return EventManager.historic_vals[asdu + ";" + io];
    }

    constructor() {
    
        if (! EventManager.is_instance_created) {
            EventManager.is_instance_created = true;
            EventManager.instance = new EventManager();

            EventManager.vals = {};

            /**
             * asdu;io -> [val1;timestamp, val2;timestamp, ... 20]
             */
            EventManager.historic_vals = {};

            /**
             * asdu;io -> last second push
             */
            EventManager.last_update = {};

            class MessageEmitter extends EventEmitter {};

            EventManager.messageEmitter = new MessageEmitter();
     
            EventManager.messageEmitter.on(eventTypes.DEFAULT, (payload) => {
                // console.log('event occurred with payload', payload);

                payload = JSON.parse(payload);
             
                let date_ob = new Date();
                let seconds = date_ob.getSeconds();

                console.log("current seconds", seconds);

                // console.log("----------")

                // new implementation
                for (let [key, value] of Object.entries(payload)) {

                    // console.log(key, " -> ", value);

                    let raw_key = key.substring(1, key.length -1).split(",");
                    
                    raw_key = raw_key.map((i) => Number(i));

                    if (value.startsWith("SingleValue")) {

                        value = value.split(".")[1];

                    } else if (value.startsWith("FloatingValue")) {
                    
                        value = value.substring(0, value.length - 1).split("=")[1];

                    }

                    // console.log(raw_key);
                    // console.log("val", value);

                    let ai_key = raw_key[0] + ";" + raw_key[1];

                    EventManager.vals[ai_key] = value;

                    if (! EventManager.historic_vals[ai_key]) {
                        // console.log("first", value);
                        EventManager.historic_vals[ai_key] = [];
                    } 

                    if (! EventManager.last_update[ai_key]) {
               
                        EventManager.last_update[ai_key] = seconds;

                        EventManager.historic_vals[ai_key].push(value + ";" + new Date().getTime());
                        // console.log("update");
                    } else {

                        // console.log("last update", EventManager.last_update[ai_key]);

                        if (Math.abs(seconds - EventManager.last_update[ai_key]) >= 1) {

                            EventManager.last_update[ai_key] = seconds;

                            EventManager.historic_vals[ai_key].push(value + ";" + new Date().getTime());

                        }

                    }
 
                    /**
                     * only 20 values per asdu,io pair
                     * 
                     */
                    while (EventManager.historic_vals[ai_key].length > 20) {
                        EventManager.historic_vals[ai_key].shift();
                    }

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
