hat-quickstart
==============

This repository contains a minimal working example that uses
`Hat-core <https://core.hat-open.com/docs>`_ for its infrastructure. The example
makes use of all ``hat-core`` components that interact with monitor and event
server, other components may be used optionally. To run, install the
requirements and run scripts in the ``playground/run`` directory.

This repository uses doit as its build tool, make sure to call ``doit list`` to
check available tasks. Some functions require certain tasks to be executed
before they can run properly, e.g. calling ``doit js_view`` is necessary to be
able to access the graphical interface.

Docker
------

The quickstart repository can also be run from docker. A Dockerfile is provided
to create an image that contains all dependencies and can be used to run the
whole system. To build and run, see the `Docker documentation
<https://docs.docker.com/get-started/>`_.

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


launch simulator

	python3 simulator/main.py

launch backend

	from (venv) .../mnt/c/git/ket-praksa/assignment-marin-jovanovic/src/playground/run$ ./system.sh

external resources (frontend template):

	https://github.com/estevanmaito/windmill-dashboard

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



http://localhost:23023/index.html
user
pass


ligthing image
	https://icon-library.com/icon/lightning-icon-png-15.html


todo

	backend revert comm fix
	maximize window button fix
	check val refreshing
	switch gui update
	null value display