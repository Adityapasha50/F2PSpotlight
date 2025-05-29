'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const favorites = [
      {
        UserId: 1, // User 1 (GameMaster)
        GameId: 452, // Contoh game ID dari API
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserId: 1, // User 1 (GameMaster)
        GameId: 516, // Contoh game ID lain dari API
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserId: 2, // User 2 (ProGamer)
        GameId: 452, // Game yang sama dengan user 1
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Favorites', favorites, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Favorites', null, {});
  }
};