const request = require('supertest');
const app = require('../../app');
const { User, Game, Transaction } = require('../../models');
const { generateToken } = require('../../helpers/jwt');

// Fungsi untuk membuat user pengujian
async function createTestUser() {
  const userData = {
    email: 'test@example.com',
    password: 'password123',
    username: 'testuser',
    profilePicture: 'https://example.com/profile.jpg'
  };
  
  const user = await User.create(userData);
  const token = generateToken({
    id: user.id,
    email: user.email,
    username: user.username
  });
  
  return { user, token };
}

// Fungsi untuk membuat game pengujian
async function createTestGame() {
  const gameData = {
    title: 'Test Game',
    thumbnail: 'https://example.com/thumbnail.jpg',
    short_description: 'A test game',
    game_url: 'https://example.com/game',
    genre: 'Testing',
    platform: 'Web Browser',
    publisher: 'Test Publisher',
    developer: 'Test Developer',
    release_date: '2023-01-01',
    freetogame_profile_url: 'https://example.com/profile'
  };
  
  return await Game.create(gameData);
}

module.exports = {
  app,
  request,
  createTestUser,
  createTestGame
};