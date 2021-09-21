/**
 * switch click is in switch_logic.js
 */



// todo check current selected

const clickable = {
	TRANSFROMATOR: "transformator",
	BUS: "bus",
	OTHER: "other",
    LINE: "line",
}


function click_linker() {
    
    minimize();

// open graph
    open_graph();

}

let current_selected = clickable.OTHER;
let curr_number = NaN;

function pre(type) {
    if (current_selected == type) {
            console.log("already showing this")

        let info_block = document.querySelector(".valsandg");

        info_block.style.visibility = "hidden";

        setTimeout(function () {
            info_block.style.visibility = "visible";
        }, 100);
        
        return false;
    } 

    return true;
}

function line_clicked(line_id) {

    (async () => {

        click_linker();
        let curr = clickable.LINE;
        curr_number = line_id;
        let mapper = {
            "Aktivna snaga na početku voda [MW]": "1" + String(line_id) + ";0",
            "Jalova snaga na početku voda [MVar]": "1" + String(line_id) + ";1",
            "Aktivna snaga na kraju voda [MW]": "1" + String(line_id) + ";2",
            "Jalova snaga na kraju voda [MVar]": "1" + String(line_id) + ";3", 
            "Opterećenje [%]": "1" + String(line_id) + ";4",
        }; 

        click_action_general(curr, mapper, line_id);

    })();
}

function bus_clicked(bus_id) {
    (async () => {
        click_linker();
        let curr = clickable.BUS;
        curr_number = bus_id;
        let mapper = {
            "Aktivna snaga [MW]": String(bus_id) + ";0",
            "Jalova snaga [MVar]": String(bus_id) + ";1",
        };

        click_action_general(curr, mapper, bus_id);

    })();
}

function trafo_clicked() {
    (async () => {
        click_linker();
        let curr = clickable.TRANSFROMATOR;
        curr_number = -1;
        let mapper = {
            "Aktivna snaga na strani s višim naponom [MW]": "20;0",
            "Jalova snaga na strani s višim naponom [MVar]": "20;1",
            "Aktivna snaga na strani s nižim naponom [MW]": "20;2",
            "Jalova snaga na strani s nižim naponom [MVar]": "20;3",
            "Opterećenje [%]": "20;4"
        };
    
        click_action_general(curr, mapper, -1);
    
    })();
}

async function draw_graph_driver(labels) {
    // for graph drawing, todo
    

    let t = document.querySelector("div.grid:nth-child(1)");
    t.style.float = "left";
    // t.style.background = "Red";
    t.style.width = "50%";
    t.style.height = "100%";

    // float:left; 
    // background:Red;
    // width:25%;
    // height:280px;



    // let main2 = document.querySelector("body > div > div > main > div > div > div.tmp");
    let main2 = document.getElementById("overlay");
    main2.innerHTML = "";
    
    let graph_template = document.querySelector('#chart-template');
    let graph = graph_template.content.cloneNode(true);        
    main2.appendChild(graph);

    plot_graph(labels);

    // main2.innerHTML = "";
    //  graph_template = document.querySelector('#chart-template');
    //   graph = graph_template.content.cloneNode(true);        
    // main2.appendChild(graph);
    // plot_graph(labels);

    t = main2;
    // let t = document.querySelector("div.grid:nth-child(1)");
    t.style.float = "right";
    // t.style.background = "blue";
    t.style.width = "50%";
    t.style.height = "100%";


    // float:right;
    // background:blue;
    // width:25%;
    // height:280px;

}

async function click_action_general(curr, mapper, num_id) {

    if (! pre(curr)) {
        return;
    }

    let main = document.querySelector("body > div > div > main > div > div > div.grid.gap-6.mb-8.md\\:grid-cols-2.xl\\:grid-cols-4");
    main.innerHTML = "";
    
    current_selected = curr;
    
    document.querySelector(".valsandg").style.visibility = "visible";

    let categoryTemplate = document.querySelector('#card-template');

    let v = [];

    for (const [key, value] of Object.entries(mapper)) {
    
        let category = categoryTemplate.content.cloneNode(true);
        let title = category.querySelector("div > div:nth-child(2) > p.mb-2.text-sm.font-medium.text-gray-600.dark\\:text-gray-400")
        title.textContent = key;
        let val = category.querySelector("div > div:nth-child(2) > p.text-lg.font-semibold.text-gray-700.dark\\:text-gray-200")
        val.textContent = await get_val(value);
        val.id = value;
        main.appendChild(category);
    
        v.push(key);
    }

    draw_graph_driver(mapper);

    reloader(curr, num_id, mapper);
}

async function get_val(key) {
    let response = await fetch('http://localhost:3000/api-single/' + key);
    response = await response.json();
    // console.log("response", response);
    return response["value"];            
}

async function reloader(currently_selected, curr_selected_number, mapper) {
    /**
     * refresh values every second
     */

    // console.log("reloader called");
    const delay = ms => new Promise(res => setTimeout(res, ms));

    let old_vals = {}

    for (const [key, value] of Object.entries(mapper)) {
        old_vals[key] = value;
    }

    while (current_selected == currently_selected && curr_number == curr_selected_number) {

        for (const [key, value] of Object.entries(mapper)) {

            let new_val = await get_val(value);

            if (old_vals[key] != new_val) {
                old_vals[key] = new_val;

                document.getElementById(value).innerHTML = await get_val(value);
                console.log("new val");
            }

        }
          
        await fetch('http://localhost:3000/refresh/');

        // console.log("refreshing");

        await delay(1000);
    }

    console.log("reloader done");
}

function on() {
    document.getElementById("overlay").style.display = "block";
}
  
function off() {
    document.getElementById("overlay").style.display = "none";

    let main2 = document.getElementById("overlay");
    main2.innerHTML = "";
    

    let t = document.querySelector("div.grid:nth-child(1)");
    t.style.removeProperty("float");
    t.style.removeProperty("width");
    t.style.removeProperty("height");

    // t.style.float = "left";
    // // t.style.background = "Red";
    // t.style.width = "100%";
    // t.style.height = "100%";
}

window.addEventListener('load', (event) => {
    document.getElementById("overlay").onclick = function() {
        off();
    };      

    // document.getElementById("tmp1").onclick = function() {
    //     on();
    // };      
});

function open_graph() {
    on();
}