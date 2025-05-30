const { Game } = require('../../models');

describe('Game Model', () => {
  // Setup data sebelum semua pengujian
  beforeAll(async () => {
    // Bersihkan tabel Game sebelum memulai pengujian
    await Game.destroy({ where: {}, truncate: true, cascade: true });
  });

  // Bersihkan tabel Game setelah semua pengujian
  afterAll(async () => {
    await Game.destroy({ where: {}, truncate: true, cascade: true });
  });

  describe('validations', () => {
    it('should create a game successfully with valid data', async () => {
      const gameData = {
        id: 1,
        title: 'Test Game',
        thumbnail: 'https://example.com/thumbnail.jpg',
        short_description: 'A test game for unit testing',
        game_url: 'https://example.com/game',
        genre: 'Testing',
        platform: 'Web Browser',
        publisher: 'Test Publisher',
        developer: 'Test Developer',
        release_date: '2023-01-01',
        freetogame_profile_url: 'https://example.com/profile'
      };

      const game = await Game.create(gameData);
      expect(game).toHaveProperty('id', gameData.id);
      expect(game).toHaveProperty('title', gameData.title);
      expect(game).toHaveProperty('thumbnail', gameData.thumbnail);
      expect(game).toHaveProperty('genre', gameData.genre);
      expect(game).toHaveProperty('platform', gameData.platform);
    });

    it('should not create a game without required fields', async () => {
      const invalidGameData = {
        // Missing id and title
        thumbnail: 'https://example.com/thumbnail.jpg',
        short_description: 'An invalid game for testing',
        game_url: 'https://example.com/game'
      };

      await expect(Game.create(invalidGameData)).rejects.toThrow();
    });

    it('should not create a game with invalid URL format', async () => {
      const invalidUrlGameData = {
        id: 2,
        title: 'Invalid URL Game',
        thumbnail: 'not-a-valid-url',
        short_description: 'A game with invalid URL',
        game_url: 'also-not-valid-url',
        genre: 'Testing',
        platform: 'Web Browser',
        freetogame_profile_url: 'invalid-url'
      };

      await expect(Game.create(invalidUrlGameData)).rejects.toThrow();
    });

    it('should not create a game with duplicate ID', async () => {
      // Create first game
      const gameData1 = {
        id: 3,
        title: 'First Game',
        thumbnail: 'https://example.com/thumbnail1.jpg',
        game_url: 'https://example.com/game1'
      };

      await Game.create(gameData1);

      // Try to create second game with same ID
      const gameData2 = {
        id: 3, // Duplicate ID
        title: 'Second Game',
        thumbnail: 'https://example.com/thumbnail2.jpg',
        game_url: 'https://example.com/game2'
      };

      await expect(Game.create(gameData2)).rejects.toThrow();
    });
  });

  describe('optional fields', () => {
    it('should create a game with minimal required fields', async () => {
      const minimalGameData = {
        id: 4,
        title: 'Minimal Game'
      };

      const game = await Game.create(minimalGameData);
      expect(game).toHaveProperty('id', minimalGameData.id);
      expect(game).toHaveProperty('title', minimalGameData.title);
      expect(game).toHaveProperty('short_description', null);
      expect(game).toHaveProperty('genre', null);
    });
  });
});