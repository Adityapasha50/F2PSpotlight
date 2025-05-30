const request = require('supertest');
const app = require('../../app');
const { User, Game } = require('../../models');
const { hashPassword } = require('../../helpers/bcrypt');
const { generateToken } = require('../../helpers/jwt');
const { OAuth2Client } = require('google-auth-library');

// Mock Google OAuth2Client
jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn().mockImplementation(() => ({
    verifyIdToken: jest.fn().mockResolvedValue({
      getPayload: jest.fn().mockReturnValue({
        email: 'google@example.com',
        name: 'Google User',
        picture: 'https://example.com/picture.jpg'
      })
    })
  }))
}));

describe('UserController', () => {
  let testUser;
  let testToken;
  
  beforeEach(async () => {
    // Seed user untuk testing
    await User.destroy({ truncate: { cascade: true } });
    await Game.destroy({ truncate: { cascade: true } });
    
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
  });
  
  describe('POST /users/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({
          username: 'newuser',
          email: 'new@example.com',
          password: 'password'
        });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user).toHaveProperty('email', 'new@example.com');
    });
    
    it('should return 400 if email already registered', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({
          username: 'testuser2',
          email: 'test@example.com', // Email yang sudah ada
          password: 'password'
        });
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
    
    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({
          username: 'incomplete',
          // Email hilang
          password: 'password'
        });
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });
  
  describe('POST /users/login', () => {
    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: 'test@example.com',
          password: 'password'
        });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('access_token');
      expect(res.body).toHaveProperty('user');
    });
    
    it('should return 400 if email not provided', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          password: 'password'
        });
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
    
    it('should return 400 if password not provided', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: 'test@example.com'
        });
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
    
    it('should return 401 if email not registered', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: 'notregistered@example.com',
          password: 'password'
        });
      
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });
    
    it('should return 401 if password incorrect', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });
      
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });
  });
  
  describe('GET /users/profile', () => {
    it('should return user profile when authenticated', async () => {
      const res = await request(app)
        .get('/users/profile')
        .set('Authorization', `Bearer ${testToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', testUser.id);
      expect(res.body).toHaveProperty('email', testUser.email);
      expect(res.body).toHaveProperty('username', testUser.username);
    });
    
    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .get('/users/profile');
      
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });
  });
  
  describe('PUT /users/profile', () => {
    it('should update user profile successfully', async () => {
      const res = await request(app)
        .put('/users/profile')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          username: 'updateduser',
          profilePicture: 'https://example.com/updated.jpg'
        });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Profile updated successfully');
      
      // Verifikasi perubahan di database
      const updatedUser = await User.findByPk(testUser.id);
      expect(updatedUser.username).toBe('updateduser');
      expect(updatedUser.profilePicture).toBe('https://example.com/updated.jpg');
    });
    
    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .put('/users/profile')
        .send({
          username: 'updateduser'
        });
      
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });
  });
  
  describe('POST /users/google-login', () => {
    it('should login with Google successfully for new user', async () => {
      const res = await request(app)
        .post('/users/google-login')
        .send({
          id_token: 'valid-google-token'
        });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('access_token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('email', 'google@example.com');
    });
    
    it('should login with Google successfully for existing user', async () => {
      // Buat user dengan email yang sama dengan mock Google
      await User.create({
        username: 'googleuser',
        email: 'google@example.com',
        password: hashPassword('password'),
        profilePicture: 'https://example.com/google.jpg'
      });
      
      const res = await request(app)
        .post('/users/google-login')
        .send({
          id_token: 'valid-google-token'
        });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('access_token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('email', 'google@example.com');
    });
    
    it('should return 400 if id_token not provided', async () => {
      const res = await request(app)
        .post('/users/google-login')
        .send({});
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Google token is required');
    });
  });
});