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

let current_selected = clickable.OTHER;

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
 
    if (! pre(clickable.LINE)) {
        return;
    }

    let main = document.querySelector("body > div > div > main > div > div > div.grid.gap-6.mb-8.md\\:grid-cols-2.xl\\:grid-cols-4");
    main.innerHTML = "";

    current_selected = clickable.LINE;
    
    document.querySelector(".valsandg").style.visibility = "visible";

    let categoryTemplate = document.querySelector('#card-template');

    let title, val, category;

    category = categoryTemplate.content.cloneNode(true);
    title = category.querySelector("div > div:nth-child(2) > p.mb-2.text-sm.font-medium.text-gray-600.dark\\:text-gray-400")
    title.textContent = "Aktivna snaga na početku voda [MW]";
    val = category.querySelector("div > div:nth-child(2) > p.text-lg.font-semibold.text-gray-700.dark\\:text-gray-200")
    val.textContent = "val 1";
    main.appendChild(category);

    category = categoryTemplate.content.cloneNode(true);
    title = category.querySelector("div > div:nth-child(2) > p.mb-2.text-sm.font-medium.text-gray-600.dark\\:text-gray-400")
    title.textContent = "Jalova snaga na početku voda [MVar]";
    val = category.querySelector("div > div:nth-child(2) > p.text-lg.font-semibold.text-gray-700.dark\\:text-gray-200")
    val.textContent = "val 1";
    main.appendChild(category);

    category = categoryTemplate.content.cloneNode(true);
    title = category.querySelector("div > div:nth-child(2) > p.mb-2.text-sm.font-medium.text-gray-600.dark\\:text-gray-400")
    title.textContent = "Aktivna snaga na kraju voda [MW]";
    val = category.querySelector("div > div:nth-child(2) > p.text-lg.font-semibold.text-gray-700.dark\\:text-gray-200")
    val.textContent = "val 1";
    main.appendChild(category);

    category = categoryTemplate.content.cloneNode(true);
    title = category.querySelector("div > div:nth-child(2) > p.mb-2.text-sm.font-medium.text-gray-600.dark\\:text-gray-400")
    title.textContent = "Jalova snaga na kraju voda [MVar]";
    val = category.querySelector("div > div:nth-child(2) > p.text-lg.font-semibold.text-gray-700.dark\\:text-gray-200")
    val.textContent = "val 1";
    main.appendChild(category);

    category = categoryTemplate.content.cloneNode(true);
    title = category.querySelector("div > div:nth-child(2) > p.mb-2.text-sm.font-medium.text-gray-600.dark\\:text-gray-400")
    title.textContent = "Opterećenje [%]";
    val = category.querySelector("div > div:nth-child(2) > p.text-lg.font-semibold.text-gray-700.dark\\:text-gray-200")
    val.textContent = "val 1";
    main.appendChild(category);
}

function bus_clicked(bus_id) {

    if (! pre(clickable.BUS)) {
        return;
    }

    let main = document.querySelector("body > div > div > main > div > div > div.grid.gap-6.mb-8.md\\:grid-cols-2.xl\\:grid-cols-4");
    let main2 = document.querySelector("body > div > div > main > div > div > div.tmp");

    main.innerHTML = "";
    main2.innerHTML = "";
    
    current_selected = clickable.BUS;
    current_id = bus_id;
    
    document.querySelector(".valsandg").style.visibility = "visible";

    let categoryTemplate = document.querySelector('#card-template');
    let graph_template = document.querySelector('#chart-template');

    let graph;

    let title, val, category;

    category = categoryTemplate.content.cloneNode(true);
    title = category.querySelector("div > div:nth-child(2) > p.mb-2.text-sm.font-medium.text-gray-600.dark\\:text-gray-400")
    title.textContent = "Aktivna snaga [MW]";
    val = category.querySelector("div > div:nth-child(2) > p.text-lg.font-semibold.text-gray-700.dark\\:text-gray-200")
    val.textContent = "val prvi";
    main.appendChild(category);

    category = categoryTemplate.content.cloneNode(true);
    title = category.querySelector("div > div:nth-child(2) > p.mb-2.text-sm.font-medium.text-gray-600.dark\\:text-gray-400")
    title.textContent = "Jalova snaga [MVar]";
    val = category.querySelector("div > div:nth-child(2) > p.text-lg.font-semibold.text-gray-700.dark\\:text-gray-200")
    val.textContent = "val 1";
    main.appendChild(category);

    graph = graph_template.content.cloneNode(true);        
    main2.appendChild(graph);
    plot_graph();

}

function trafo_clicked() {

    if (! pre(clickable.TRANSFROMATOR)) {
        return;
    }

    let main = document.querySelector("body > div > div > main > div > div > div.grid.gap-6.mb-8.md\\:grid-cols-2.xl\\:grid-cols-4");

    main.innerHTML = "";
    
    current_selected = clickable.TRANSFROMATOR;
    
    document.querySelector(".valsandg").style.visibility = "visible";

    let categoryTemplate = document.querySelector('#card-template');

    let title, val, category;

    category = categoryTemplate.content.cloneNode(true);
    title = category.querySelector("div > div:nth-child(2) > p.mb-2.text-sm.font-medium.text-gray-600.dark\\:text-gray-400")
    title.textContent = "Aktivna snaga na strani s višim naponom [MW]";
    val = category.querySelector("div > div:nth-child(2) > p.text-lg.font-semibold.text-gray-700.dark\\:text-gray-200")
    val.textContent = "val 1";
    main.appendChild(category);

    category = categoryTemplate.content.cloneNode(true);
    title = category.querySelector("div > div:nth-child(2) > p.mb-2.text-sm.font-medium.text-gray-600.dark\\:text-gray-400")
    title.textContent = "Jalova snaga na strani s višim naponom [MVar]";
    val = category.querySelector("div > div:nth-child(2) > p.text-lg.font-semibold.text-gray-700.dark\\:text-gray-200")
    val.textContent = "val 1";
    main.appendChild(category);

    category = categoryTemplate.content.cloneNode(true);
    title = category.querySelector("div > div:nth-child(2) > p.mb-2.text-sm.font-medium.text-gray-600.dark\\:text-gray-400")
    title.textContent = "Aktivna snaga na strani s nižim naponom [MW]";
    val = category.querySelector("div > div:nth-child(2) > p.text-lg.font-semibold.text-gray-700.dark\\:text-gray-200")
    val.textContent = "val 1";
    main.appendChild(category);

    category = categoryTemplate.content.cloneNode(true);
    title = category.querySelector("div > div:nth-child(2) > p.mb-2.text-sm.font-medium.text-gray-600.dark\\:text-gray-400")
    title.textContent = "Jalova snaga na strani s nižim naponom [MVar]";
    val = category.querySelector("div > div:nth-child(2) > p.text-lg.font-semibold.text-gray-700.dark\\:text-gray-200")
    val.textContent = "val 1";
    main.appendChild(category);

    category = categoryTemplate.content.cloneNode(true);
    title = category.querySelector("div > div:nth-child(2) > p.mb-2.text-sm.font-medium.text-gray-600.dark\\:text-gray-400")
    title.textContent = "Opterećenje [%]";
    val = category.querySelector("div > div:nth-child(2) > p.text-lg.font-semibold.text-gray-700.dark\\:text-gray-200")
    val.textContent = "val 1";
    main.appendChild(category);

}