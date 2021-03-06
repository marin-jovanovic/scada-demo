/**
 * For usage, visit Chart.js docs https://www.chartjs.org/docs/latest/
 */
 function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function timestamp_to_sth_readable(timestamp_time) {
  let unix_timestamp = timestamp_time;
  let date = new Date(unix_timestamp);
  let hours = date.getHours();
  let minutes = "0" + date.getMinutes();
  let seconds = "0" + date.getSeconds();

  return [hours, minutes.substr(-2), seconds.substr(-2)];
}

let do_i_need_to_reload_graph = false;
let what_to_reload;
let current_graph;
let graph_is_mouse_in = false;

function graph_reloader(labels) {
  (async () => {

      const delay = ms => new Promise(res => setTimeout(res, ms));

      what_to_reload = labels;

      while (do_i_need_to_reload_graph) {
          is_any_graph_displayed = true;

          if (!graph_is_mouse_in) {
              let t = document.querySelector("div.grid:nth-child(1)");
              t.style.float = "left";
              t.style.width = "50%";
              t.style.height = "100%";

              let main2 = document.getElementById("overlay");
              main2.innerHTML = "";

              let graph_template = document.querySelector('#chart-template');
              let graph = graph_template.content.cloneNode(true);
              main2.appendChild(graph);

              plot_graph(what_to_reload);

              t = main2;
              t.style.float = "right";
              t.style.width = "50%";
              t.style.height = "100%";

              do_i_need_to_reload_graph = true;


          }

          await delay(9000);
      }

      console.log("graph reloader done");

  })();
}

function plot_graph(labels_type) {
  (async () => {

      new Chart(document.getElementById("line"), {});

      let payload = [];
      let data;

      let colors_i = 0;
      let colors = [
          "#ffcc00",
          "#ff66cc",
          "#0099ff",
          "#009900",
          "#3333ff",
          "#ff99ff",
          "#DFFF00",
          "#FFBF00",
          "#FF7F50",
          "#DE3163",
      ]

      for (const [key, value] of Object.entries(labels_type)) {
          let raw = value.split(";");

          let response = await fetch('http://localhost:3000/historical_vals/' + raw[0] + '/' + raw[1]);
          response = await response.json();

          data = response["value"];

          let t_d = {};

          let max_interval_exceded = false;

          /**
           * reverse because data is processed in chronological order
           */
          data.reverse().forEach(element => {

              if (!max_interval_exceded) {
                  let raw = element.split(";");

                  let that_time = Number(raw[1]);

                  let current_timestamp = new Date().getTime();
                  let f = timestamp_to_sth_readable(current_timestamp);
                  let s = timestamp_to_sth_readable(that_time);

                  let h_diff = f[0] - s[0];
                  let m_diff = f[1] - s[1];

                  if (h_diff == 0 && m_diff == 0) {

                      let s_diff = f[2] - s[2];

                      if (s_diff > 20) {

                          max_interval_exceded = true;

                      } else {

                          t_d[s_diff] = raw[0];

                      }

                  }

              }

          });

          /**
           * transform to right direction
           */
          let new_t_d = {};
          for (const [key, value] of Object.entries(t_d)) {
              new_t_d[20 - key] = value;

          }
          t_d = new_t_d;

          /**
           * insert missing values
           */
          let have_i_seen_first_val = false;
          let prev;

          for (let i = 0; i < 21; i++) {

              if (!(i in t_d)) {
                  if (!have_i_seen_first_val) {
                      t_d[i] = 0;
                  } else {
                      let next_;

                      for (let j = i; j < 21; j++) {
                          if (j in t_d) {
                              next_ = t_d[j];
                              break;
                          }
                      }

                      if (!next_) {

                          t_d[i] = prev;
                      } else {
                          t_d[i] = (Number(prev) + Number(next_)) / 2;
                      }
                  }

              } else {
                  have_i_seen_first_val = true;
                  prev = t_d[i];
              }

          }

          let t = [];
          for (const [key, value] of Object.entries(t_d)) {
              t.push(value);
          }

          payload.push({
              label: key,
              backgroundColor: colors[colors_i],
              borderColor: colors[colors_i + 1],
              data: t,
              fill: false,
          });

          colors_i += 2;

      }


      // x axis labels
      let time_labels = [];
      for (let i = 1; i < 21; i++) {
          time_labels.push("-" + (21 - i));
      }
      time_labels.push("0")

      const lineConfig = {
          type: 'line',
          data: {
              labels: time_labels,
              datasets: payload,
          },
          options: {
              responsive: true,
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

      const lineCtx = document.getElementById("line");
      // window.myLine = new Chart(lineCtx, lineConfig);

      new Chart(lineCtx, lineConfig);

  })();
}