'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    static associate(models) {
      // define association here
      Favorite.belongsTo(models.Game, { foreignKey: 'GameId' });
      Favorite.belongsTo(models.User, { foreignKey: 'UserId' });
    }
  }
  Favorite.init({
    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
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
    GameId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Games',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Game ID is required'
        },
        notEmpty: {
          msg: 'Game ID is required'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Favorite',
  });
  return Favorite;
};
