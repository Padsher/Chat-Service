const log = console.log;

const { Message, User } = require('../models');

module.exports = (app, chatUpdater) => {
	app.post('/messages', async (request, response) => {
		log('message post request');
		const { message } = request.body;
		const { login } = request;
		log(message);
		log(login);
		const user = await User.findOne({
			where: {
				login,
			},

			attributes: ['id', 'login'],
		});

		await Message.create({
			message,
			UserId: user.dataValues.id,
		});

		chatUpdater.updateChat({ text: message, user: user.dataValues.login });

		response.sendStatus(200);
	});

	app.get('/messages', async (request, response) => {
		log('message get request');

		let messages = await Message.findAll({
			order: [
				['createdAt'],
			],
			attributes: ['message'],
			include: [{
				model: User,
				attributes: ['login'],
			}],
		});
		messages = messages.map((message) => {
			return {
				text: message.dataValues.message,
				user: message.dataValues.User.dataValues.login,
			};
		});
		log(messages);
		response.json(messages);
	});

	app.get('/logout', async (request, response) => {
		log('logout request');
		chatUpdater.deleteUser(request.login);
	});
};