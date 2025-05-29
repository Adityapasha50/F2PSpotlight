const { User } = require('../../models');
const { comparePassword } = require('../../helpers/bcrypt');

describe('User Model', () => {
  // Clear users table after all tests
  afterAll(async () => {
    await User.destroy({ where: {}, truncate: true, cascade: true });
  });

  describe('validations', () => {
    it('should create a user successfully with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser'
      };

      const user = await User.create(userData);
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email', userData.email);
      expect(user).toHaveProperty('username', userData.username);
      expect(user).toHaveProperty('profilePicture');
    });

    it('should not create a user with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        username: 'testuser'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should not create a user with duplicate email', async () => {
      // Create first user
      const userData = {
        email: 'duplicate@example.com',
        password: 'password123',
        username: 'firstuser'
      };

      await User.create(userData);

      // Try to create second user with same email
      const duplicateData = {
        email: 'duplicate@example.com',
        password: 'password456',
        username: 'seconduser'
      };

      await expect(User.create(duplicateData)).rejects.toThrow();
    });
  });

  describe('hooks', () => {
    it('should hash password before creating user', async () => {
      const userData = {
        email: 'hook@example.com',
        password: 'password123',
        username: 'hookuser'
      };

      const user = await User.create(userData);
      
      // Password should be hashed
      expect(user.password).not.toBe(userData.password);
      
      // Should be able to verify password
      const isPasswordValid = comparePassword(userData.password, user.password);
      expect(isPasswordValid).toBe(true);
    });
  });
});