window.addEventListener('load', function () {
    /**
     * api handler for cotacting backend
     */
     let r = get_val("adapter 02");
      
});

function get_val(key) {
    (async () => {
      
      while (true) {

        // console.log("api haandler")
  
        let response = await fetch('http://localhost:3000/api/' + key);
  
        // console.log("response", response);
        response = await response.json();
  
        console.log("response", response);

        for (const [key, value] of Object.entries(response)) {
            console.log(`---------> ${key}: ${value}`);
        }
  
        if ('/adapter/20;2' in response) {
          document.getElementById("gfggg").innerHTML = response['/adapter/20;2'];
            
        } else {
          document.getElementById("gfggg").innerHTML = 'undefined';
          
        }
  
        // document.getElementById("gfggg").innerHTML = response;
         

      }
    
    })();
  }
  