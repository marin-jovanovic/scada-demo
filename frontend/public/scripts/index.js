function clicked() {
    // alert("clicked");
}

window.addEventListener('load', function () {
    
    driver_tab_name_changer();

    let num_of_switches = 8;

    init_switch_drivers(num_of_switches);

    for (let i = 0; i < 7; i++) {
        document.getElementById("bus-" + String(i)).onclick = 
            function() {bus_clicked(i)};    
    }

    for (let i = 0; i < 4; i++) {
        document.getElementById("line-" + String(i)).onclick = 
            function() {line_clicked(i)};    
    }
    
    for (let i = 0; i < 8; i++) {
        document.getElementById("switch-" + String(i)).onclick = 
            function() {sw_clicked(i)};    
    }

    document.getElementsByClassName("transformator")[0].onclick = 
        function() {trafo_clicked()};    

    document.getElementById("maximize").onclick = 
        function() {maximize()}; 
        
});

// logging for min/ max button
let zoom_status = "min";

/**
 * for button that is on svg image to maximize svg image
 *  * @returns 
 */

function maximize() {

    if (zoom_status == "max") {
        return;
    } else {
        zoom_status = "max";
    }

    off();

    console.log("maximize");

    // hide current measurings
    let main = document.querySelector("body > div > div > main > div > div.valsandg");

    main.innerHTML = "<br><div class=\"grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4\"></div><div class=\"tmp\"></div>";

    current_selected = clickable.OTHER;
    current_id = -1;

//   zoom in image
    let img_svg = document.querySelector("div.grid:nth-child(1) > div:nth-child(2) > svg:nth-child(1)");

    img_svg.style.height = '115%'
    img_svg.style.width = '140%'

    img_svg.style.position = "relative";
    img_svg.style.left = "-20%";
    img_svg.style.right = "50%";

    // remove zoom button

    let max_img = document.querySelector("#maximize");
    max_img.style.display = "none";
    switch_logic(num_of_switches);

}

/**
 * for button that is on svg image to minimize svg image when something is clicked
 * @returns 
 */
function minimize() {

    if (zoom_status == "min") {
        return;
    } else {
        zoom_status = "min";
    }

    console.log("minimize");

    // hide current measurings
    let main = document.querySelector("body > div > div > main > div > div.valsandg");

    main.innerHTML = "<br><div class=\"grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4\"></div><div class=\"tmp\"></div>";

    current_selected = clickable.OTHER;
    current_id = -1;

    //   zoom out image
    let img_svg = document.querySelector("div.grid:nth-child(1) > div:nth-child(2) > svg:nth-child(1)");

    img_svg.style.height = '100%'
    img_svg.style.width = '100%'

    img_svg.style.position = "relative";
    img_svg.style.left = "00%";
    img_svg.style.right = "50%";

    // add zoom button

    let max_img = document.querySelector("#maximize");
    max_img.style.display = "block";
    switch_logic(num_of_switches);

}

