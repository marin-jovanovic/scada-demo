/**
 * For usage, visit Chart.js docs https://www.chartjs.org/docs/latest/
 */


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function plot_graph(labels_type) {
  (async () => {

  // console.log("labels", labels_type);

  let payload = [];
  let data;
  
  for (const [key, value] of Object.entries(labels_type)) {

    let raw = value.split(";");

    let response = await fetch('http://localhost:3000/historical_vals/'+raw[0]+'/'+raw[1]);
    response = await response.json();

    console.log("actual data", response);

    // todo add desc or asc
    //  response = await fetch('http://localhost:8000/'+raw[0]+'/'+raw[1]+'/10');
    // response = await response.json();
    
    // data = response["data"];

    data = response["value"];

    // let t = [];
    // data.forEach(element => {
    //   t.push(element.value);
    // });

    let t = [];
    let current_timestamp = new Date().getTime();
    console.log("curr timestamp", current_timestamp)

    function timestamp_to_sth_readable(timestamp_time) {
      // let unix_timestamp = 1549312452 1632216484479
      let unix_timestamp = timestamp_time;
      // Create a new JavaScript Date object based on the timestamp
      // multiplied by 1000 so that the argument is in milliseconds, not seconds.
      // var date = new Date(unix_timestamp * 1000);
      var date = new Date(unix_timestamp);
      // Hours part from the timestamp
      var hours = date.getHours();
      // Minutes part from the timestamp
      var minutes = "0" + date.getMinutes();
      // Seconds part from the timestamp
      var seconds = "0" + date.getSeconds();

      // Will display time in 10:30:23 format
      var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

      console.log(formattedTime);
    
      return [hours, minutes.substr(-2), seconds.substr(-2)];
    }

    console.log("curr time", current_timestamp)
    // timestamp_to_sth_readable(current_timestamp);

    let curr_offset = 0;

    data.forEach(element => {
      let raw = element.split(";");
      console.log(raw);

      let that_time = Number(raw[1]);

      let f = timestamp_to_sth_readable(current_timestamp);
      let s = timestamp_to_sth_readable(that_time);

      let h_diff = f[0] - s[0];
      let m_diff = f[1] - s[1];
      let s_diff = f[2] - s[2];

      console.log("diff", h_diff, m_diff, s_diff);
      
      if (h_diff == 0 && m_diff == 0) {
        console.log("smae all dunno secS  ")

        

        // while (s_diff != curr_offset) {
        //   curr_offset++;
        //   t.push(-1);
        // }
        t.push(raw[0]);


      }



    });

    // for (const [key, value] of Object.entries(data)) {
      

    // }

    payload.push(
      {
        label: key,
        backgroundColor: '#0694a2',
        borderColor: '#0694a2',
        data: t,
        fill: false,
      }
    );

  }


  let time_labels = [];
  for (let i = 0; i < 21; i++) {
    time_labels.push("-" + i);
  }

  const lineConfig = {
    type: 'line',
    data: {
      labels: time_labels,
      datasets: 
        payload,
      
      // [
      //   {
      //     label: labels_type[0],
      //     /**
      //      * These colors come from Tailwind CSS palette
      //      * https://tailwindcss.com/docs/customizing-colors/#default-color-palette
      //      */
      //     backgroundColor: '#0694a2',
      //     borderColor: '#0694a2',
      //     // data: [43, 48, 40, 54, 67, 73, 70],
  
      //     data: [43, 48, 40, 54],
  
      //     fill: false,
  
      //   },
      //   {
      //     label: labels_type[1],
      //     fill: false,
      //     /**
      //      * These colors come from Tailwind CSS palette
      //      * https://tailwindcss.com/docs/customizing-colors/#default-color-palette
      //      */
      //     backgroundColor: '#7e3af2',
      //     borderColor: '#7e3af2',
      //     data: [24, 50, 64, 74, 52, 51, 65],
      //   },
      // ],
    },
    options: {
      responsive: true,
      /**
       * Default legends are ugly and impossible to style.
       * See examples in charts.html to add your own legends
       *  */
      legend: {
        display: false,
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true,
      },
      scales: {
        x: {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Month',
          },
        },
        y: {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Value',
          },
        },
      },
    },
  }


  

  // change this to the id of your chart element in HMTL
  const lineCtx = document.getElementById("line");
  // console.log("line", lineCtsx);
  window.myLine = new Chart(lineCtx, lineConfig);

})();
}
