module.exports = (sequelize, Sequelize) => {
  const Message = sequelize.define('Message', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
      field: 'id',
    },
    message: {
      type: Sequelize.STRING,
      field: 'message',
   	},
    UserId: {
      type: Sequelize.INTEGER,
      field: 'author_id',
      references: {
      	model: 'Users',
      	key: 'id',
      },
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
  	tableName: 'Messages',
  });
  return Message;
};