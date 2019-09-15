'use strict';
const Sequelize = require('sequelize');
const NODE_ENV = process.env['NODE_ENV'] || 'development';
const config = require('../config/config.json')[NODE_ENV];

const sequelize = new Sequelize(config.database, config.username, config.password, config);
const User = require('../models/user.js')(sequelize, Sequelize);
module.exports = {
  up: () => {
    return User.sync({
      force: true,
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable(User.getTableName());
  }
};