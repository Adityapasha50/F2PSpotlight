'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    static associate(models) {
      Game.belongsToMany(models.User, { through: models.Favorite });
      // Tambahkan asosiasi dengan Transaction untuk Midtrans
      Game.hasMany(models.Transaction, { foreignKey: 'gameId' });
    }
  }
  Game.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Game title is required'
        },
        notEmpty: {
          msg: 'Game title is required'
        }
      }
    },
    thumbnail: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: 'Thumbnail must be a valid URL'
        }
      }
    },
    short_description: DataTypes.TEXT,
    game_url: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: 'Game URL must be a valid URL'
        }
      }
    },
    genre: DataTypes.STRING,
    platform: DataTypes.STRING,
    publisher: DataTypes.STRING,
    developer: DataTypes.STRING,
    release_date: DataTypes.STRING,
    freetogame_profile_url: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: 'Profile URL must be a valid URL'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Game',
  });
  return Game;
};