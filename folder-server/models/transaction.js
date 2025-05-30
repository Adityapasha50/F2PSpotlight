'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User, { foreignKey: 'userId' });
      Transaction.belongsTo(models.Game, { foreignKey: 'gameId' });
    }
  }
  Transaction.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'User ID is required'
        },
        notEmpty: {
          msg: 'User ID is required'
        }
      }
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Amount is required'
        },
        notEmpty: {
          msg: 'Amount is required'
        },
        min: {
          args: [1],
          msg: 'Amount must be greater than 0'
        }
      }
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Game ID is required'
        },
        notEmpty: {
          msg: 'Game ID is required'
        }
      }
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    },
    orderId: {
      type: DataTypes.STRING,
      unique: true
    },
    paymentType: DataTypes.STRING,
    snapToken: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};