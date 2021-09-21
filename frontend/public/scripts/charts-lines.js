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

function plot_graph(labels_type) {
  (async () => {

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
        "#9FE2BF",
        "#40E0D0",
        "#6495ED",
        "#CCCCFF"
      ]

      for (const [key, value] of Object.entries(labels_type)) {
          console.log();
          console.log();
          console.log();

          let raw = value.split(";");

          let response = await fetch('http://localhost:3000/historical_vals/' + raw[0] + '/' + raw[1]);
          response = await response.json();

          data = response["value"];

          let t_d = {};

          let max_interval_exceded = false;

          console.log("prep data", data);
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

                    console.log("more than 20s passed, will not log after this");
                    max_interval_exceded = true;

                  } else {

                    t_d[s_diff] = raw[0];

                  }

                }

              }

          });

          /**
           * key is time that tells how old this data is
           * val
           */
          console.log("poor data", t_d);

          let max_index = -1;

          for (const [key, value] of Object.entries(t_d)) {
              if (key > max_index) {
                  max_index = key;
              }
          }

          console.log("max index", max_index);

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
                if (! have_i_seen_first_val) {
                  t_d[i] = 0;
                } else {
                  let next_;

                  for (let j = i; j < 21; j++) {
                    if (j in t_d) {
                      next_ = t_d[j];
                      break;
                    }
                  }

                  console.log("current", i);
                  if (! next_) {
                    console.log("no next");
                    next_ = prev;

                    t_d[i] = prev;
                  } else {
                    t_d[i] = (Number(prev) + Number(next_)) / 2;
                  }
                  // console.log("match", prev, next_);
                  // t_d[i] = 444;
                }

                  // for (let j = i; j < 21; j++) {

                  // }

              } else {
                if (! have_i_seen_first_val) {
                  have_i_seen_first_val = true;
                }
                prev = t_d[i];
              }

          }

          console.log("rich data", t_d);
          // for (const [key, value] of Object.entries(t_d)) {
          //   console.log(key, "->", value)
          // }

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
      window.myLine = new Chart(lineCtx, lineConfig);

  })();
}