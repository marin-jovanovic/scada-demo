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

      // console.log(formattedTime);
    
      return [hours, minutes.substr(-2), seconds.substr(-2)];
    }

    let curr_offset = 0;

    let t_d = {};

    data.forEach(element => {
      console.log();
      console.log();
      console.log();
      
      let raw = element.split(";");

      let that_time = Number(raw[1]);

      let f = timestamp_to_sth_readable(current_timestamp);
      let s = timestamp_to_sth_readable(that_time);

      let h_diff = f[0] - s[0];
      let m_diff = f[1] - s[1];
      let s_diff = f[2] - s[2];

      console.log("diff", h_diff, m_diff, s_diff);
      
      if (h_diff == 0 && m_diff == 0) {
        console.log("smae all dunno secS  ")

        t_d[s_diff] = raw[0];

        if (s_diff > 20) {
          console.log("more than 20s");
          // continue;
        }

      }

      t.push(raw[0]);

    });

    console.log(t_d);

    let max_index = -1;

    for (const [key, value] of Object.entries(t_d)) {
      if (key > max_index) {
        max_index = key;
      }
    }

    console.log("max index", max_index);  

    for (let i = 0; i < 21; i++) {
      // const element = array[i];

        if (! (i in t_d)) {
          t_d[i] = 0;
        }

    }


    // let prev;
    // let fol;

    // for (let i = 0; i < 21; i++) {
    //   if (! (i in t_d)) {
    //     if (! prev) {
    //       console.log("no prev", t_d)
    //       for (let j = i; j < 21; j++) {
    //         if (j in t_d) {
    //           console.log("using", t_d[j]);
    //           t_d[i] = t_d[j];
              
    //           prev = t_d[j];
    //           break;
    //         }
    //       }
    //     } else {
    //       console.log("prev", t_d)
    //       for (let j = i; j < 21; j++) {
    //         if (j in t_d) {
    //           console.log("using", t_d[j]);
    //           t_d[i] = (prev + t_d[j]) / 2;
    //           break;
    //         }
    //       }
    //     }
    //   } 
    // }

    for (const [key, value] of Object.entries(t_d)) {
      console.log(key, "->", value)
    }

    t = [];
    for (const [key, value] of Object.entries(t_d)) {
      // console.log(key, "->", value)
      t.push(value);
    }

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
  for (let i = 1; i < 21; i++) {
    time_labels.push("-" + (21 - i));
  }
  time_labels.push("0")

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
