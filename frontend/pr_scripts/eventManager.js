const EventEmitter = require('events');

const eventTypes = {
    // new vals
    DEFAULT: 'default',
}

function init() {
    
}

module.exports = class EventManager {

    getInstance() {
        return EventManager.instance;
    }

    getValSingle(val) {
        return EventManager.vals[val];
    }

    getVals() {

        // EventManager.ret_vals = {};

        // for (var key in EventManager.vals) {
        //     if (key in EventManager.already_have) {
        //         if (EventManager.vals != EventManager.already_have[key]) {
        //             // new val
        //             EventManager.ret_vals[key] = EventManager.vals;
        //             EventManager.already_have[key] = EventManager.vals;
        //         }

        //         // ignore if same there
        //     } else {
        //         // dont have this, add it

        //         EventManager.ret_vals[key] = EventManager.vals;
        //         EventManager.already_have[key] = EventManager.vals;
        //     }
        // }

        // console.log("new vals", EventManager.ret_vals);
// ////////////////////
        return EventManager.vals;


        // ////////////////////////////////

        // let ret_dict = {};

        // for (var key in EventManager.new_vals) {
        //     ret_dict[key] = EventManager.new_vals[key];
        // }

        // // reset 
        // EventManager.new_vals = {};

        // console.log("new vals", ret_dict);

        // return ret_dict;


        // console.log("new vals", EventManager.new_vals);

        // return EventManager.new_vals;
    }

    constructor() {
    
        if (! EventManager.is_instance_created) {
            EventManager.is_instance_created = true;
            EventManager.instance = new EventManager();

            EventManager.vals = {};
            // EventManager.new_vals = {};

            EventManager.already_have = {};

            EventManager.ret_vals = {};
    
            class MessageEmitter extends EventEmitter {};

            EventManager.messageEmitter = new MessageEmitter();
     
            EventManager.messageEmitter.on(eventTypes.DEFAULT, (payload) => {
                // console.log('event occurred with payload', payload);

                if (payload.value.constructor == Object) {

                    for (const [key, value] of Object.entries(payload.value)) {

                        EventManager.vals[key] = value;
                 
                        // if (! key in EventManager.vals) {
                        //     EventManager.vals[key] = value;
                        //     EventManager.new_vals[key] = value;
                        // } else if (EventManager.vals[key] == value) {
                        //     // same val, already in vals, no need to add
                        // } else if (EventManager.vals[key] != value) {
                        //     // already in .vals but with different val
                        //     EventManager.vals[key] = value;
                            
                        //     EventManager.new_vals[key] = value;
                        // } 
                    }

                } else {
                    EventManager.vals[payload.path] = payload.value;
                }

                // console.log(EventManager.vals);

            });

        }
    }

    emitEvent(payload) {
        EventManager.messageEmitter.emit(eventTypes.DEFAULT, payload);
    }
    
}
