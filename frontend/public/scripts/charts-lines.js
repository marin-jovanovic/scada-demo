/**
 * For usage, visit Chart.js docs https://www.chartjs.org/docs/latest/
 */


function plot_graph(labels_type) {
  (async () => {

  // console.log("labels", labels_type);

  let payload = [];

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  let data;
  
  for (const [key, value] of Object.entries(labels_type)) {

    let raw = value.split(";");

    // todo add desc or asc
    let response = await fetch('http://localhost:8000/'+raw[0]+'/'+raw[1]+'/10');
    response = await response.json();
    
    data = response["data"];

    // console.log("repsones");
    // console.log(data);

    data.forEach(element => {
      console.log(element.date, element.value);
    });

    t = [];
    data.forEach(element => {
      // console.log(element.date, element.value);
    
      t.push(element.value);
    });

    

    payload.push(
      {
        label: key,
        backgroundColor: '#0694a2',
        borderColor: '#0694a2',

        data: t,
        // data: [getRandomInt(52), getRandomInt(52), getRandomInt(55), getRandomInt(15)],

        fill: false,

      }
    );

  }

  const lineConfig = {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
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
