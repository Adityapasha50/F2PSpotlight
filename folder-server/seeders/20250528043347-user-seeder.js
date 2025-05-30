'use strict';
const { hashPassword } = require('../helpers/bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = [
      {
        email: 'user1@example.com',
        password: hashPassword('password123'),
        username: 'GameMaster',
        profilePicture: 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user2@example.com',
        password: hashPassword('password123'),
        username: 'ProGamer',
        profilePicture: 'https://res.cloudinary.com/demo/image/upload/v1/sample2.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user3@example.com',
        password: hashPassword('password123'),
        username: 'CasualPlayer',
        profilePicture: 'https://res.cloudinary.com/demo/image/upload/v1/sample3.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Users', users, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};