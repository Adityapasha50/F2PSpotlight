const request = require('supertest');
const app = require('../../app');
const { Game, User } = require('../../models');

describe('GameController', () => {
  beforeEach(async () => {
    // Seed games untuk testing
    await Game.destroy({ truncate: { cascade: true } });
    
    await Game.bulkCreate([
      {
        title: 'Game 1',
        thumbnail: 'https://example.com/game1.jpg',
        description: 'Description for Game 1',
        genre: 'Action',
        platform: 'PC',
        publisher: 'Publisher 1',
        developer: 'Developer 1',
        releaseDate: '2023-01-01',
        gameUrl: 'https://example.com/game1'
      },
      {
        title: 'Game 2',
        thumbnail: 'https://example.com/game2.jpg',
        description: 'Description for Game 2',
        genre: 'RPG',
        platform: 'PC, Mobile',
        publisher: 'Publisher 2',
        developer: 'Developer 2',
        releaseDate: '2023-02-01',
        gameUrl: 'https://example.com/game2'
      },
      {
        title: 'Game 3',
        thumbnail: 'https://example.com/game3.jpg',
        description: 'Description for Game 3',
        genre: 'Strategy',
        platform: 'PC',
        publisher: 'Publisher 3',
        developer: 'Developer 3',
        releaseDate: '2023-03-01',
        gameUrl: 'https://example.com/game3'
      }
    ]);
  });
  
  describe('GET /games', () => {
    it('should return all games with default pagination', async () => {
      const res = await request(app).get('/games');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('games');
      expect(res.body).toHaveProperty('pagination');
      expect(res.body.games.length).toBe(3);
    });
    
    it('should return games with custom pagination', async () => {
      const res = await request(app).get('/games?page=1&limit=2');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('games');
      expect(res.body).toHaveProperty('pagination');
      expect(res.body.games.length).toBe(2);
      expect(res.body.pagination).toHaveProperty('currentPage', 1);
      expect(res.body.pagination).toHaveProperty('limit', 2);
    });
    
    it('should return filtered games by search', async () => {
      const res = await request(app).get('/games?search=Game 1');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('games');
      expect(res.body.games.length).toBe(1);
      expect(res.body.games[0]).toHaveProperty('title', 'Game 1');
    });
    
    it('should return filtered games by platform', async () => {
      const res = await request(app).get('/games?platform=Mobile');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('games');
      expect(res.body.games.length).toBe(1);
      expect(res.body.games[0]).toHaveProperty('title', 'Game 2');
    });
  });
  
  describe('GET /games/:id', () => {
    it('should return a specific game by id', async () => {
      const game = await Game.findOne({ where: { title: 'Game 1' } });
      
      const res = await request(app).get(`/games/${game.id}`);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title', 'Game 1');
      expect(res.body).toHaveProperty('genre', 'Action');
    });
    
    it('should return 404 if game not found', async () => {
      const res = await request(app).get('/games/9999');
      
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Game not found');
    });
  });
  
  describe('GET /games/category/:category', () => {
    it('should return games by category', async () => {
      const res = await request(app).get('/games/category/RPG');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('games');
      expect(res.body.games.length).toBe(1);
      expect(res.body.games[0]).toHaveProperty('title', 'Game 2');
      expect(res.body.games[0]).toHaveProperty('genre', 'RPG');
    });
    
    it('should return empty array if no games in category', async () => {
      const res = await request(app).get('/games/category/Simulation');
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('games');
      expect(res.body.games.length).toBe(0);
    });
  });
});