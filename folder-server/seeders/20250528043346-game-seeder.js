'use strict';
const axios = require('axios');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      const response = await axios.get('https://www.freetogame.com/api/games');
      const games = response.data.slice(0, 300).map(game => {
        return {
          id: game.id,
          title: game.title,
          thumbnail: game.thumbnail,
          short_description: game.short_description,
          game_url: game.game_url,
          genre: game.genre,
          platform: game.platform,
          publisher: game.publisher,
          developer: game.developer,
          release_date: game.release_date,
          freetogame_profile_url: game.freetogame_profile_url,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      });
      
      await queryInterface.bulkInsert('Games', games, {});
    } catch (error) {
      console.error('Error seeding games:', error);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Games', null, {});
  }
};