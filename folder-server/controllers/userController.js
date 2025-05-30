const { User } = require('../models');
const { comparePassword } = require('../helpers/bcrypt');
const { generateToken } = require('../helpers/jwt');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client();

class UserController {
  static async register(req, res, next) {
    try {
      const { email, password, username } = req.body;
      
      // Default profile picture jika tidak disediakan
      const profilePicture = req.body.profilePicture || 'https://ui-avatars.com/api/?name=' + username;
      
      const user = await User.create({
        email,
        password,
        username,
        profilePicture
      });
      
      res.status(201).json({
        id: user.id,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        throw { name: 'BadRequest', message: 'Email and password are required' };
      }
      
      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        throw { name: 'Unauthorized', message: 'Invalid email or password' };
      }
      
      const isPasswordValid = comparePassword(password, user.password);
      
      if (!isPasswordValid) {
        throw { name: 'Unauthorized', message: 'Invalid email or password' };
      }
      
      const payload = {
        id: user.id,
        email: user.email,
        username: user.username
      };
      
      const token = generateToken(payload);
      
      res.status(200).json({
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          profilePicture: user.profilePicture
        }
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async getProfile(req, res, next) {
    try {
      const { id } = req.user;
      
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      });
      
      if (!user) {
        throw { name: 'NotFound', message: 'User not found' };
      }
      
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
  
  static async updateProfile(req, res, next) {
    try {
      const { id } = req.user;
      const { username, profilePicture } = req.body;
      
      const user = await User.findByPk(id);
      
      if (!user) {
        throw { name: 'NotFound', message: 'User not found' };
      }
      
      const updatedData = {};
      
      if (username) updatedData.username = username;
      if (profilePicture) updatedData.profilePicture = profilePicture;
      
      await User.update(updatedData, {
        where: { id }
      });
      
      res.status(200).json({
        message: 'Profile updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async googleLogin(req, res, next) {
    try {
      const { id_token } = req.body;
      
      if (!id_token) {
        throw { name: 'BadRequest', message: 'Google token is required' };
      }
      
      const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      
      const payload = ticket.getPayload();
      const email = payload.email;
      
      // Cek apakah user sudah ada di database
      let user = await User.findOne({ where: { email } });
      
      if (!user) {
        // Buat user baru jika belum ada
        user = await User.create({
          email: email,
          username: payload.name || email.split('@')[0],
          profilePicture: payload.picture || `https://ui-avatars.com/api/?name=${payload.name || email.split('@')[0]}`,
          password: Math.random().toString(36).slice(-8), // Random password
        });
      }
      
      // Generate token untuk user
      const tokenPayload = {
        id: user.id,
        email: user.email,
        username: user.username
      };
      
      const token = generateToken(tokenPayload);
      
      res.status(200).json({
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          profilePicture: user.profilePicture
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;