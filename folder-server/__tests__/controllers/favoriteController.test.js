const request = require('supertest');
const app = require('../../app');
const { User, Game, Favorite } = require('../../models');
const { hashPassword } = require('../../helpers/bcrypt');
const { generateToken } = require('../../helpers/jwt');

describe('FavoriteController', () => {
  let testUser;
  let testToken;
  let testGame;
  
  beforeEach(async () => {
    // Seed data untuk testing
    await User.destroy({ truncate: { cascade: true } });
    await Game.destroy({ truncate: { cascade: true } });
    await Favorite.destroy({ truncate: { cascade: true } });
    
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashPassword('password'),
      profilePicture: 'https://example.com/profile.jpg'
    });
    
    testToken = generateToken({
      id: testUser.id,
      email: testUser.email,
      username: testUser.username
    });
    
    testGame = await Game.create({
      title: 'Test Game',
      thumbnail: 'https://example.com/game.jpg',
      description: 'Test game description',
      genre: 'Action',
      platform: 'PC',
      publisher: 'Test Publisher',
      developer: 'Test Developer',
      releaseDate: '2023-01-01',
      gameUrl: 'https://example.com/game'
    });
    
    // Tambahkan game kedua untuk testing
    await Game.create({
      title: 'Another Game',
      thumbnail: 'https://example.com/game2.jpg',
      description: 'Another game description',
      genre: 'RPG',
      platform: 'Mobile',
      publisher: 'Another Publisher',
      developer: 'Another Developer',
      releaseDate: '2023-02-01',
      gameUrl: 'https://example.com/game2'
    });
  });
  
  describe('GET /favorites', () => {
    it('should return user favorites when authenticated', async () => {
      // Tambahkan game ke favorit user
      await Favorite.create({
        UserId: testUser.id,
        GameId: testGame.id
      });
      
      const res = await request(app)
        .get('/favorites')
        .set('Authorization', `Bearer ${testToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toHaveProperty('title', 'Test Game');
    });
    
    it('should return empty array when user has no favorites', async () => {
      const res = await request(app)
        .get('/favorites')
        .set('Authorization', `Bearer ${testToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });
    
    it('should return 401 if not authenticated', async () => {
      const res = await request(app).get('/favorites');
      
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });
  });
  
  describe('POST /favorites/:gameId', () => {
    it('should add game to favorites successfully', async () => {
      const res = await request(app)
        .post(`/favorites/${testGame.id}`)
        .set('Authorization', `Bearer ${testToken}`);
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'Game added to favorites');
      
      // Verifikasi di database
      const favorite = await Favorite.findOne({
        where: {
          UserId: testUser.id,
          GameId: testGame.id
        }
      });
      expect(favorite).not.toBeNull();
    });
    
    it('should return 400 if game already in favorites', async () => {
      // Tambahkan game ke favorit terlebih dahulu
      await Favorite.create({
        UserId: testUser.id,
        GameId: testGame.id
      });
      
      const res = await request(app)
        .post(`/favorites/${testGame.id}`)
        .set('Authorization', `Bearer ${testToken}`);
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Game already in favorites');
    });
    
    it('should return 404 if game not found', async () => {
      const res = await request(app)
        .post('/favorites/9999')
        .set('Authorization', `Bearer ${testToken}`);
      
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Game not found');
    });
    
    it('should return 401 if not authenticated', async () => {
      const res = await request(app).post(`/favorites/${testGame.id}`);
      
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });
  });
  
  describe('DELETE /favorites/:gameId', () => {
    it('should remove game from favorites successfully', async () => {
      // Tambahkan game ke favorit terlebih dahulu
      await Favorite.create({
        UserId: testUser.id,
        GameId: testGame.id
      });
      
      const res = await request(app)
        .delete(`/favorites/${testGame.id}`)
        .set('Authorization', `Bearer ${testToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Game removed from favorites');
      
      // Verifikasi di database
      const favorite = await Favorite.findOne({
        where: {
          UserId: testUser.id,
          GameId: testGame.id
        }
      });
      expect(favorite).toBeNull();
    });
    
    it('should return 404 if game not in favorites', async () => {
      const res = await request(app)
        .delete(`/favorites/${testGame.id}`)
        .set('Authorization', `Bearer ${testToken}`);
      
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Game not found in favorites');
    });
    
    it('should return 401 if not authenticated', async () => {
      const res = await request(app).delete(`/favorites/${testGame.id}`);
      
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });
  });
});