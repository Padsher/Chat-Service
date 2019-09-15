'use strict';
const Sequelize = require('sequelize');
const NODE_ENV = process.env['NODE_ENV'] || 'development';
const config = require('../config/config.json')[NODE_ENV];

const sequelize = new Sequelize(config.database, config.username, config.password, config);
const Message = require('../models/message.js')(sequelize, Sequelize);
module.exports = {
  up: () => {
    return Message.sync({
      force: true,
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable(Message.getTableName());
  }
};