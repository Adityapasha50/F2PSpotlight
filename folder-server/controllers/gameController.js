const { Game } = require('../models');
const { Op } = require('sequelize');

class GameController {
  static async getAllGames(req, res, next) {
    try {
      // Pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      // Search by title
      const search = req.query.search || '';
      
      // Filter by platform
      const platform = req.query.platform || '';
      
      // Build where clause
      const whereClause = {};
      
      if (search) {
        whereClause.title = {
          [Op.iLike]: `%${search}%`
        };
      }
      
      if (platform) {
        whereClause.platform = {
          [Op.iLike]: `%${platform}%`
        };
      }
      
      const { count, rows } = await Game.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['title', 'ASC']]
      });
      
      const totalPages = Math.ceil(count / limit);
      
      res.status(200).json({
        games: rows,
        pagination: {
          total: count,
          totalPages,
          currentPage: page,
          limit
        }
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async getGameById(req, res, next) {
    try {
      const { id } = req.params;
      
      const game = await Game.findByPk(id);
      
      if (!game) {
        throw { name: 'NotFound', message: 'Game not found' };
      }
      
      res.status(200).json(game);
    } catch (error) {
      next(error);
    }
  }
  
  static async getByCategory(req, res, next) {
    try {
      const { category } = req.params;
      
      // Pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      const { count, rows } = await Game.findAndCountAll({
        where: {
          genre: {
            [Op.iLike]: `%${category}%`
          }
        },
        limit,
        offset,
        order: [['title', 'ASC']]
      });
      
      const totalPages = Math.ceil(count / limit);
      
      res.status(200).json({
        games: rows,
        pagination: {
          total: count,
          totalPages,
          currentPage: page,
          limit
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GameController;