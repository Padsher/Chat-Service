const log = console.log;
const Sequelize = require('sequelize');
const NODE_ENV = process.env['NODE_ENV'] || 'development';
const config = require('../config/config.json')[NODE_ENV];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const User = require('./user.js')(sequelize, Sequelize);
const Message = require('./message.js')(sequelize, Sequelize);

Message.belongsTo(User);

module.exports = {
	User,
	Message,
	sequelize,
};
