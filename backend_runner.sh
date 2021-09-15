#!/bin/sh
# init_venv.sh

activate () {
  . /mnt/c/git/marin-jovanovic/scada-demo/venv/bin/activate
  echo "activated"
}
activate
cd backend/playground/run
echo "venv activated"
echo "listen on:"
echo "localhost:23023"
sh system.sh