# scada-demo

[Opis zadatka](docs/assignment.md).

[Prijedlog koraka razvoja](docs/development_steps.md).

[Opis arhitekture](docs/architecture.md).

[Frontend tutorial](docs/frontend.md).

[Docker workflow](docs/docker.md).


install (ubuntu)

create venv
	python3 -m venv venv

activate venv
	source venv/bin/activate

install requirements
	pip install -r requirements.pip.txt


launch

python3 simulator/main.py

run from 
(venv) .../mnt/c/git/ket-praksa/assignment-marin-jovanovic/src/playground/run$ ./system.sh

resources:
	https://github.com/estevanmaito/windmill-dashboard


python venv
	python3 -m venv venv
	source venv/bin/activate

requirements
	sudo apt-get install $(grep -vE "^\s*#" requirements.ubuntu.txt  | tr "\n" " ")
	if that fails try:
	sudo apt-get install package1 package2 package3 ... # from requirements.ubuntu.txt



pip install -r requirements.pip.txt
