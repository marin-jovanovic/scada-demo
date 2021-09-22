#!/bin/sh

#!/bin/sh
# init_venv.sh

activate () {
  . /home/marin/Documents/git/marin-jovanovic/scada-demo/venv/bin/activate
  echo "venv activated"
}
activate

# fixme run functions from here,each in new shell
xfce4-terminal  -e  "bash -c /home/marin/Documents/git/marin-jovanovic/scada-demo/start_simulator.sh;bash" &
P1=$!
sleep 10
xfce4-terminal  -e  "bash -c /home/marin/Documents/git/marin-jovanovic/scada-demo/start_linker.sh;bash" &
P2=$!
xfce4-terminal  -e  "bash -c /home/marin/Documents/git/marin-jovanovic/scada-demo/start_frontend.sh;bash" &
P3=$!
xfce4-terminal  -e  "bash -c /home/marin/Documents/git/marin-jovanovic/scada-demo/start_server.sh;bash" &
P4=$!
xfce4-terminal  -e  "bash -c /home/marin/Documents/git/marin-jovanovic/scada-demo/start_db.sh;bash" &
P5=$!

wait $P1 $P2 $P3 $P4 $P5