const { Game } = require('../models');
const { Op } = require('sequelize');
const GeminiHelper = require('../helpers/gemini');

class GeminiController {
  static async getPopularGame(req, res) {
    try {
      const { genre } = req.params;
      if (!genre) return res.status(400).json({ message: 'Genre is required' });
  
      const games = await Game.findAll({ 
        where: { genre: { [Op.iLike]: `%${genre}%` } },
        limit: 10
      });
      
      if (games.length === 0) return res.status(404).json({ message: 'No games found' });
      
      // Gunakan helper untuk mendapatkan ID game populer
      const gameId = await GeminiHelper.findPopularGameId(games, genre);
      
      if (!gameId) {
        console.log("No ID found in Gemini response, using fallback");
        return res.status(200).json({ 
          message: 'AI could not determine the most popular game, using fallback', 
          game: games[0] 
        });
      }
      
      const popularGame = await Game.findByPk(gameId);
      
      if (!popularGame) {
        console.log("Game ID not found in database, using fallback");
        return res.status(200).json({ 
          message: 'ID not found in database, using fallback', 
          game: games[0] 
        });
      }
      
      console.log("Returning popular game:", popularGame.title);
      res.status(200).json({ message: 'Popular game found', game: popularGame });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
  
  // Metode getPopularGameSimple sudah benar
  static async getPopularGameSimple(req, res) {
    try {
      const { genre } = req.params;
      if (!genre) return res.status(400).json({ message: 'Genre is required' });
  
      const games = await Game.findAll({ 
        where: { genre: { [Op.iLike]: `%${genre}%` } },
        limit: 10
      });
      
      if (games.length === 0) return res.status(404).json({ message: 'No games found' });
  
      // Pilih game secara acak dari 3 game pertama (untuk simulasi)
      const randomIndex = Math.floor(Math.random() * Math.min(3, games.length));
      const popularGame = games[randomIndex];
  
      res.status(200).json({ message: 'Popular game found', game: popularGame });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
  
  static async testGeminiAPI(req, res) {
    try {
      const prompt = "Respond with 'API is working' if you can read this message.";
      const aiText = await GeminiHelper.generateContent(prompt);
  
      res.status(200).json({ 
        message: 'Gemini API test', 
        apiResponse: aiText,
        isWorking: aiText.includes('API is working') || aiText.includes('working')
      });
    } catch (err) {
      console.error("Gemini API test failed:", err);
      res.status(500).json({ 
        message: 'Gemini API test failed', 
        error: err.message 
      });
    }
  }
}

module.exports = GeminiController;
