// window.addEventListener('load', function () {
//     /**
//      * api handler for cotacting backend
//      */
//     //  let r = get_val("adapter 02");
      
//     load_vals("20;2");

// });

// function load_vals(key) {
//     (async () => {
//       let c = 0;
//       while (true) {

//         // console.log("api haandler")
  
//         c += 1;
//         console.log(c);
//         let response = await fetch('http://localhost:3000/api/' + key);
//         response = await response.json();
  
//         console.log("response", response);

//         // for (const [key, value] of Object.entries(response)) {
//         //     console.log(`---------> ${key}: ${value}`);
//         // }

//         console.log(response["value"]);

//         // document.getElementById("gfggg").innerHTML = response["value"];

//         // if ('/adapter/20;2' in response) {
//         //   document.getElementById("gfggg").innerHTML = response['/adapter/20;2'];
            
//         // } else {
//         //   document.getElementById("gfggg").innerHTML = 'undefined';
          
//         // }
  
//         // document.getElementById("gfggg").innerHTML = response;
         

//       }
    
//     })();
// }
