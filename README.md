Chat Service
=====================

REQUIREMENTS
------------

	assure that node 10.14.1 installed

	assure that npm 6.4.1 installed

Configurating
-------------
	
	. (dot) means root directory (where this file is)

	go to ./config/config.json
	write your database configuration

	go to ./serverConfig/config.json
	write desirable port and keys:
	- jwtShaKey: is key to use to sign JWT
	- passwordHashKey: is key to hash passwords


Setup and launching
-------------------
	
	launch your database server

	go to root directory, open terminal and run following commands:

	$ npm install

	$ npm run migrate

	$ npm start
