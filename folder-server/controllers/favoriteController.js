const { Favorite, Game, User } = require('../models');

class FavoriteController {
  static async getFavorites(req, res, next) {
    try {
      const { id } = req.user;
      
      const favorites = await Favorite.findAll({
        where: { UserId: id },
        include: [{
          model: Game,
          attributes: ['id', 'title', 'thumbnail', 'genre', 'platform']
        }]
      });
      
      const games = favorites.map(fav => fav.Game);
      
      res.status(200).json(games);
    } catch (error) {
      next(error);
    }
  }
  
  static async addFavorite(req, res, next) {
    try {
      const { id } = req.user;
      const { gameId } = req.params;
      
      // Cek apakah game ada
      const game = await Game.findByPk(gameId);
      
      if (!game) {
        throw { name: 'NotFound', message: 'Game not found' };
      }
      
      // Cek apakah sudah ada di favorites
      const existingFavorite = await Favorite.findOne({
        where: {
          UserId: id,
          GameId: gameId
        }
      });
      
      if (existingFavorite) {
        throw { name: 'BadRequest', message: 'Game already in favorites' };
      }
      
      // Tambahkan ke favorites
      await Favorite.create({
        UserId: id,
        GameId: gameId
      });
      
      res.status(201).json({
        message: 'Game added to favorites'
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async removeFavorite(req, res, next) {
    try {
      const { id } = req.user;
      const { gameId } = req.params;
      
      // Cek apakah ada di favorites
      const favorite = await Favorite.findOne({
        where: {
          UserId: id,
          GameId: gameId
        }
      });
      
      if (!favorite) {
        throw { name: 'NotFound', message: 'Game not found in favorites' };
      }
      
      // Hapus dari favorites
      await Favorite.destroy({
        where: {
          UserId: id,
          GameId: gameId
        }
      });
      
      res.status(200).json({
        message: 'Game removed from favorites'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FavoriteController;