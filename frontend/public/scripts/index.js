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

function maximize() {
    console.log("maximize");

    let main = document.querySelector("body > div > div > main > div > div.valsandg");

//    main.innerHTML = "";

    main.innerHTML = "<br><div class=\"grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4\"></div><div class=\"tmp\"></div>";

    current_selected = clickable.OTHER;
    current_id = -1;


    function setZoom(zoom,el) {
      
        transformOrigin = [0,0];
          el = el || instance.getContainer();
          var p = ["webkit", "moz", "ms", "o"],
              s = "scale(" + zoom + ")",
              oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";
  
          for (var i = 0; i < p.length; i++) {
              el.style[p[i] + "Transform"] = s;
              el.style[p[i] + "TransformOrigin"] = oString;
          }
  
          el.style["transform"] = s;
          el.style["transformOrigin"] = oString;
        
    }
  
  //setZoom(5,document.getElementsByClassName('container')[0]);
  
  function showVal(a, elem){
     var zoomScale = Number(a)/10;
     setZoom(zoomScale,elem)
    //  document.getElementsByClassName('container')[0])
  }

    let img_svg = document.querySelector("div.grid:nth-child(1) > div:nth-child(2) > svg:nth-child(1)");
    // let img_svg = document.querySelector("div.grid:nth-child(1)");

        img_svg.style.height = '125%'
    img_svg.style.width = '140%'

    // showVal(11, img_svg)
    img_svg.style.position = "relative";
    img_svg.style.left = "-20%";
    img_svg.style.right = "50%";

    // todo remove zoom button

    // img_svg.style.height = '130%'
    // img_svg.style.width = '130%'

    // img_svg.setAttribute("-ms-transform", "scale(0.5, 0.5)");
    // img_svg.setAttribute("-webkit-transform", "scale(0.5, 0.5)");
    // img_svg.setAttribute("transform", "scale(0.5, 0.5)");


    // div {
    //     -ms-transform: scale(0.5, 0.5); /* IE 9 */
    //     -webkit-transform: scale(0.5, 0.5); /* Safari */
    //     transform: scale(0.5, 0.5);
    // }

}

