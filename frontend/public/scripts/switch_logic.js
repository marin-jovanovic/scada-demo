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
 
     (async () => {
         for (let i = 0; i < 8; i++) {
             let vals = await get_val("3" + i + ";0");
 
             if (vals == "OFF") {
 
                 sw_clicked_driver(i);
             }
         }
 
 
     })();
 
 
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
 
         if (document.hidden) {
 
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
 
 }
 
 function fade(element) {
     var op = 1; // initial opacity
     var timer = setInterval(function() {
         if (op <= 0.1) {
             clearInterval(timer);
             element.style.visibility = "hidden";
             // element.style.display = 'none';
         }
         element.style.opacity = op;
         element.style.filter = 'alpha(opacity=' + op * 100 + ")";
         op -= op * 0.1;
     }, 100);
 }
 
 function sw_clicked_driver(switch_id) {
     let element = document.querySelector("#switch-" + String(switch_id));
     // update switch gui component
     let raw_string = element.getAttribute("d").split(" ");
     let last = Number(raw_string.pop());
     let reformated = raw_string.join(" ") + " "
 
     switch (switch_states[switch_id]) {
         case switch_status.OPENED:
             last += 10;
             reformated += String(last);
             element.setAttribute("d", reformated);
             break;
 
         case switch_status.CLOSED:
             last -= 10;
             reformated += String(last);
             element.setAttribute("d", reformated);
             break;
 
         default:
             console.log("switch error on toggle");
             break;
     }
 
     // update @switch_states
     // toggle switch state
     switch_states[switch_id] = toggle_switch_status(switch_states[switch_id]);
 
 }
 
 function sw_clicked(switch_id) {
 
 
     // show notification on screen
     document.querySelector("#success").style.visibility = "visible";
     fade(document.querySelector("#success"));
 
     // setTimeout(function () {
     //     document.querySelector("#success").style.visibility = "hidden";
     // }, 2000);
 
 
     sw_clicked_driver(switch_id);
 
 
     //  update switch in simulation
     (async () => {
         let state = switch_states[switch_id].toLowerCase();
 
         if (state == "closed") {
             state = "opened";
         } else if (state == "opened") {
             state = "closed";
         }
 
         await fetch('http://localhost:3000/switch_toggle/' + "3" + switch_id + ";" + "0" + ";" + state);
     })();
 
 }