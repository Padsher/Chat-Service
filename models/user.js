module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
      field: 'id',
    },
    login: {
      type: Sequelize.STRING,
      field: 'login',
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      field: 'password',
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      field: 'created_at',
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      field: 'updated_at',
    },
  }, {
  	tableName: 'Users',
  });
  return User;
};