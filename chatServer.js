const http = require('http');
const url = require('url');
const querystring = require('querystring');
const express = require('express');
const bodyParser = require('body-parser');
const ws = require('ws');

const {
  User,
  Message,
} = require('./models');

const makeRoutes = require('./middlewares/routes.js');
const makeStatic = require('./middlewares/static.js');

const {
  createAuthMiddleware,
  createSignupHandler,
  checkWsAuth,
} = require('./middlewares/middlewares.js');

// class to update chat through webSocket
const ChatUpdater = require('./src/ChatUpdater.js');
const chatUpdater = new ChatUpdater();

const log = console.log;
const NODE_ENV = process.env['NODE_ENV'] || 'development';
const config = require('./serverConfig/config.json')[NODE_ENV];

const app = express();
app.use(bodyParser.json());

// logging middleware
app.use((request, response, next) => {
	log(`request
		Request headers
		${JSON.stringify(request.headers)}

		Auth Key
		${request.headers.authorization}

		Url
		${request.url}

		Method
		${request.method}

		Body
		${JSON.stringify(request.body)}`);

	next();
});

// static file responsing
makeStatic(app);

// signup handler before authorization middleware
app.post('/signup', createSignupHandler(config.jwtShaKey));
app.use(createAuthMiddleware(config.jwtShaKey));

makeRoutes(app, chatUpdater);

// global error handler
app.use((err, request, response, next) => {
	log(`Error occured: ${err}`);
});
const server = http.createServer(app);

// creating websocket handler
const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', (ws, login) => {
	ws.on('close', () => {
		log(`${login} has closed WebSocket`);
		chatUpdater.deleteUser(login);
	});

	ws.on('error', () => {
		log(`${login} WebSocket error occured`);
		chatUpdater.deleteUser(login);
	});
	chatUpdater.addUser(ws, login);
});

// creating handler for websocket handshake
server.on('upgrade', async (request, socket, head) => {
	log('incoming Web Socket handshake...')
	const parsedUrl = url.parse(request.url);
	log(parsedUrl);
	const parsedQuery = querystring.parse(parsedUrl.query);
	log(parsedQuery);

	if (parsedUrl.pathname !== '/ws') {
		log('ws handshake pathname invalid');
		socket.destroy();
		return;
	}

	let login;
	try {
		login = await checkWsAuth(config.jwtShaKey, parsedQuery.jwt);
	} catch (e) {
		log('error in ws jwt checking');
		log(e);
		socket.destroy();
		return;
	}

	// make ws module handle handshake
	wsServer.handleUpgrade(request, socket, head, (ws) => {
		wsServer.emit('connection', ws, login);
	});
});
server.listen(config.port);
log(`chat server is listening on ${config.port} port...`);