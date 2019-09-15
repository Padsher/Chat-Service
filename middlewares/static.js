const log = console.log;
const path = require('path');

module.exports = (app) => {
	app.get('/', (request, response) => {
		log('main page');
		response.type('.html');
		response.status(200).sendFile(path.resolve(__dirname, '../src/site/html/main.html'));
	});
	app.get('/js/main.js', (request, response) => {
		log('main.js')
		response.type('.js');
		response.status(200).sendFile(path.resolve(__dirname, '../src/site/js/main.js'));
	});
	app.get('/js/vue.js', (request, response) => {
		log('vue.js');
		response.type('.js');
		response.status(200).sendFile(path.resolve(__dirname, '../src/site/js/vue.js'));
	});
};