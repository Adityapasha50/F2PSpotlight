const { Favorite, User, Game } = require('../../models');

describe('Favorite Model', () => {
  let testUser, testGame;

  // Setup data sebelum semua pengujian
  beforeAll(async () => {
    // Bersihkan tabel Favorite sebelum memulai pengujian
    await Favorite.destroy({ where: {}, truncate: true, cascade: true });
    
    // Buat user dan game untuk pengujian
    testUser = await User.create({
      email: 'favorite-test@example.com',
      password: 'password123',
      username: 'favoritetester'
    });
    
    testGame = await Game.create({
      id: 200,
      title: 'Favorite Test Game',
      thumbnail: 'https://example.com/favorite-thumbnail.jpg',
      game_url: 'https://example.com/favorite-game'
    });
  });

  // Bersihkan tabel Favorite, User, dan Game setelah semua pengujian
  afterAll(async () => {
    await Favorite.destroy({ where: {}, truncate: true, cascade: true });
    await User.destroy({ where: { id: testUser.id } });
    await Game.destroy({ where: { id: testGame.id } });
  });

  describe('validations', () => {
    it('should create a favorite successfully with valid data', async () => {
      const favoriteData = {
        UserId: testUser.id,
        GameId: testGame.id
      };

      const favorite = await Favorite.create(favoriteData);
      expect(favorite).toHaveProperty('id');
      expect(favorite).toHaveProperty('UserId', favoriteData.UserId);
      expect(favorite).toHaveProperty('GameId', favoriteData.GameId);
    });

    it('should not create a favorite without UserId', async () => {
      const invalidFavoriteData = {
        // Missing UserId
        GameId: testGame.id
      };

      await expect(Favorite.create(invalidFavoriteData)).rejects.toThrow();
    });

    it('should not create a favorite without GameId', async () => {
      const invalidFavoriteData = {
        UserId: testUser.id
        // Missing GameId
      };

      await expect(Favorite.create(invalidFavoriteData)).rejects.toThrow();
    });

    it('should not create duplicate favorite for same user and game', async () => {
      // Create first favorite
      const favoriteData = {
        UserId: testUser.id,
        GameId: testGame.id
      };

      // Make sure we don't have any existing favorites
      await Favorite.destroy({ where: favoriteData });
      
      // Create the favorite
      await Favorite.create(favoriteData);

      // Try to create duplicate favorite
      await expect(Favorite.create(favoriteData)).rejects.toThrow();
    });
  });

  describe('associations', () => {
    it('should be able to find favorite with associated user and game', async () => {
      // Create a new favorite
      const favoriteData = {
        UserId: testUser.id,
        GameId: testGame.id
      };

      // Make sure we don't have any existing favorites
      await Favorite.destroy({ where: favoriteData });
      
      // Create the favorite
      await Favorite.create(favoriteData);

      // Find the favorite with associations
      const favorite = await Favorite.findOne({
        where: favoriteData,
        include: [User, Game]
      });

      expect(favorite).toBeDefined();
      expect(favorite.User).toBeDefined();
      expect(favorite.User.id).toBe(testUser.id);
      expect(favorite.Game).toBeDefined();
      expect(favorite.Game.id).toBe(testGame.id);
    });
  });
});