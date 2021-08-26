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

requirements (backend)
	try:
		
		sudo apt-get install $(grep -vE "^\s*#" requirements.ubuntu.txt  | tr "\n" " ")
	except:
	
		sudo apt-get install package1 package2 package3 ... # from requirements.ubuntu.txt

		sudo apt-get install binutils-mingw-w64-x86-64 clang doxygen gcc gcc-mingw-w64-x86-64 git graphviz libffi-dev libisoburn-dev libjansson-dev libuv1-dev libyaml-dev nodejs npm openssl pandoc plantuml python3 python3-pip samba socat sqlite3 unixodbc yarn 


	pip install -r requirements.pip.txt

requirements (root)

	pip install -r requirements.pip.txt

-----------------

(root)
	doit list

	try:
		doit -f backend/dodo.py

	except:
		(backend)
		doit run
	
	except:		
		doit docs
		doit js_deps
		doit js_view
		doit py_test

	# todo ad db to gitignore


start simulator
	
	python simulator/main.py
	you should see "script started" in terminal


start backend

run from 
(venv) .../mnt/c/git/ket-praksa/assignment-marin-jovanovic/src/playground/run$ ./system.sh



pip install -r requirements.pip.txt
