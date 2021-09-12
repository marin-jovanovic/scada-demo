/**
 * make element bigger as mouse is getting closer to it
 * when mouse is getting away make it smaller
 * 
 * when out of focus make all elements small
 * 
 */

let num_of_switches;

function init_switch_drivers(num_of_switches) {

    switch_logic(num_of_switches);
    init_switch_states(num_of_switches);
    init_switch_gui();

}

function switch_logic(number_of_switches) {
    num_of_switches = number_of_switches;
    switch_positions = [];

    for (let i = 0; i < num_of_switches; i++) {

        let element = document.querySelector("#switch-" + String(i));

        var rect = element.getBoundingClientRect();

        // center point
        var middle_x = rect.right + (rect.left - rect.right) / 2;
        var middle_y = rect.bottom + (rect.top - rect.bottom) / 2;
    
        switch_positions.push(new Switch(middle_x, middle_y, element));

    }

    document.addEventListener('mousemove', function(e) {

        // mouse values
        var mouse_x = e.pageX;
        var mouse_y = e.pageY;
    
        let distance = Infinity;

        let closest_element = null;

        switch_positions.forEach(sw => {

            let d = Math.sqrt((mouse_x - sw.x) ** 2 + (mouse_y - sw.y) ** 2);

            sw.element.style.strokeWidth = 1;

            if (d < distance) {
                closest_element = sw;
                distance = d;
            }
        
        });
        
        var max_width = 10;

        var calculated_width = max_width - distance;

        // console.log("calculated distance", calculated_width);

        if (calculated_width > 0) {
            closest_element.element.style.strokeWidth = calculated_width / 2;
        } else {
            closest_element.element.style.strokeWidth = 1;
        }
    
    }, false);

    // window.onfocus = function() {
    //     console.log("focus in ");
    // }

    // alt tab
    document.addEventListener("visibilitychange", function(e) {

        if(document.hidden) {
     
            switch_positions.forEach(sw => {
                sw.element.style.strokeWidth = 1;
            });

        } 

    });
    
} 

class Switch {
    constructor(x, y, element) {
        this.x = x;
        this.y = y;
        this.element = element;
    }
}

window.addEventListener('resize', function() {
 
    // update locations of switches
    switch_logic(num_of_switches);

});

const switch_status = {
    OPENED: "opened",
    CLOSED: "closed",
}

function toggle_switch_status(current_status) {

    switch (current_status) {
        case switch_status.OPENED:

            return switch_status.CLOSED;

        case switch_status.CLOSED:

            return switch_status.OPENED;

        default:
            console.log("other", current_status);
            break;
    }
}

class SwitchGui {
    constructor(opened, closed) {
        this.opened = opened;
        this.closed = closed;
    }
}

let switch_states;

function init_switch_states(num_of_switches) {
    if (switch_states === undefined) {
        switch_states = {}
    } else {
        return;
    }

    for (let i = 0; i < num_of_switches; i++) {

        let element = document.querySelector("#switch-" + String(i));

        let raw_data = element.getAttribute("d").split(" ");
    
        // assumption: switch is horizontal
        let is_closed = raw_data[2] == raw_data[5];
    
        switch_states[i] = is_closed ? switch_status.CLOSED : switch_status.OPENED;

    }

    console.log(switch_states);
}

let switch_gui_mapping;

function init_switch_gui() {
    if (switch_gui_mapping === undefined) {
        switch_gui_mapping = {}
    } else {
        return;
    }

    // switch_gui_mapping["0"] = new SwitchGui("d: path(\"M 237 140 L 261 130\")", 
    // "d: path(\"M 237 140 L 261 140\")");
    // switch_gui_mapping["1"] = new SwitchGui("d: path(\"M 437 140 L 461 130\")", 
    // "d: path(\"M 437 140 L 461 140\")");
    // switch_gui_mapping["2"] = new SwitchGui("d: path(\"M 505 60 L 517 50\")", 
    // "d: path(\"M 505 60 L 517 60\")");
    // switch_gui_mapping["3"] = new SwitchGui("d: path(\"M 625 60 L 637 50\")", 
    // "d: path(\"M 625 60 L 637 60\")");
    // switch_gui_mapping["4"] = new SwitchGui("d: path(\"M 625 100 L 637 90\")", 
    // "d: path(\"M 625 100 L 637 100\")");
    // switch_gui_mapping["5"] = new SwitchGui("d: path(\"M 625 180 L 637 170\")", 
    // "d: path(\"M 625 180 L 637 180\")");
    // switch_gui_mapping["6"] = new SwitchGui("d: path(\"M 625 220 L 637 210\")", 
    // "d: path(\"M 625 220 L 637 220\")");
    // switch_gui_mapping["7"] = new SwitchGui("d: path(\"M 505 220 L 517 210\")", 
    // "d: path(\"M 505 220 L 517 220\")");
    switch_gui_mapping["0"] = new SwitchGui("M 237 140 L 261 130", 
    "M 237 140 L 261 140");
    switch_gui_mapping["1"] = new SwitchGui("M 437 140 L 461 130", 
    "M 437 140 L 461 140");
    switch_gui_mapping["2"] = new SwitchGui("M 505 60 L 517 50", 
    "M 505 60 L 517 60");
    switch_gui_mapping["3"] = new SwitchGui("M 625 60 L 637 50", 
    "M 625 60 L 637 60");
    switch_gui_mapping["4"] = new SwitchGui("M 625 100 L 637 90", 
    "M 625 100 L 637 100");
    switch_gui_mapping["5"] = new SwitchGui("M 625 180 L 637 170", 
    "M 625 180 L 637 180");
    switch_gui_mapping["6"] = new SwitchGui("M 625 220 L 637 210", 
    "M 625 220 L 637 220");
    switch_gui_mapping["7"] = new SwitchGui("M 505 220 L 517 210", 
    "M 505 220 L 517 220");
}
function fade(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}
function sw_clicked(switch_id) {

    let element = document.querySelector("#switch-" + String(switch_id));

    // show notification on screen
    document.querySelector("#success").style.visibility = "visible";
    setTimeout(function () {
        document.querySelector("#success").style.visibility = "hidden";
    }, 2000);

    switch (switch_states[switch_id]) {
        case switch_status.OPENED:

            // element.setAttribute("style", switch_gui_mapping[switch_id].closed);
            element.setAttribute("d", switch_gui_mapping[switch_id].closed);

            break;

        case switch_status.CLOSED:
            // element.setAttribute("style", switch_gui_mapping[switch_id].opened);
            element.setAttribute("d", switch_gui_mapping[switch_id].opened);

            break;

        default:

            console.log("switch error on toggle");

            break;
    }

    // toggle switch state
    switch_states[switch_id] = toggle_switch_status(switch_states[switch_id]);

}