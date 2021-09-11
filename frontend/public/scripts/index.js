function clicked() {
    // alert("clicked");
}

window.addEventListener('load', function () {
    console.log("page loaded");

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

    console.log('page is fully loaded');

});

function maximize() {
    console.log("maximize");

    let main = document.querySelector("body > div > div > main > div > div.valsandg");

    main.innerHTML = "";

    current_selected = clickable.OTHER;
    current_id = -1;

}

