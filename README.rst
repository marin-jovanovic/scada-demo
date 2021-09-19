# scada-demo
hat-quickstart
==============


This repository uses doit as its build tool, make sure to call ``doit list`` to
check available tasks. 

------


[Opis zadatka](docs/assignment.md).

[Prijedlog koraka razvoja](docs/development_steps.md).

[Opis arhitekture](docs/architecture.md).

[Frontend tutorial](docs/frontend.md).

[Docker workflow](docs/docker.md).


install (on ubuntu)

create venv

	python3 -m venv venv

activate venv

	source venv/bin/activate

------

install requirements

	pip install -r requirements.pip.txt


------


requirements (backend)

	try:

		sudo apt-get install $(grep -vE "^\s*#" requirements.ubuntu.txt  | tr "\n" " ")
	except:

		sudo apt-get install package1 package2 package3 ... # from requirements.ubuntu.txt

		sudo apt-get install binutils-mingw-w64-x86-64 clang doxygen gcc gcc-mingw-w64-x86-64 git graphviz libffi-dev libisoburn-dev libjansson-dev libuv1-dev libyaml-dev nodejs npm openssl pandoc plantuml python3 python3-pip samba socat sqlite3 unixodbc yarn

requirements

	pip install -r requirements.pip.txt

-----------------

doit 
	doit list

	try:
		doit -f backend/dodo.py
		doit

	except:
		doit docs
		doit js_deps
		doit js_view
		doit py_test

launch simulator

	python3 simulator/main.py
	# you should see "script started" in terminal


launch backend

	from (venv) .../mnt/c/git/ket-praksa/assignment-marin-jovanovic/src/playground/run$ ./system.sh




http://localhost:23023/index.html
user
pass


ligthing image

	https://icon-library.com/icon/lightning-icon-png-15.html

external resources (frontend template):

	https://github.com/estevanmaito/windmill-dashboard


websockets

    https://pythonrepo.com/repo/aaugustin-websockets-python-websocket

todo

	backend revert comm fix
	maximize window button fix
	check val refreshing
	switch gui update
	null value display
 	todo ad db to gitignore
