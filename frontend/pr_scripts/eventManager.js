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

    getVals() {
        return EventManager.vals;
    }

    constructor() {
    
        if (! EventManager.is_instance_created) {
            EventManager.is_instance_created = true;
            EventManager.instance = new EventManager();

            EventManager.vals = {};

            class MessageEmitter extends EventEmitter {}

            EventManager.messageEmitter = new MessageEmitter();
     
            EventManager.messageEmitter.on(eventTypes.DEFAULT, (payload) => {
                // console.log('event occurred with payload');

                if (payload.value.constructor == Object) {

                    for (const [key, value] of Object.entries(payload.value)) {
                        EventManager.vals[key] = value;
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
