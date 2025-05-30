const { verifyToken } = require('../helpers/jwt');
const { User } = require('../models');

const authentication = async (req, res, next) => {
  try {
    // Cek apakah ada header authorization
    const { authorization } = req.headers;
    if (!authorization) {
      throw { name: 'Unauthorized', message: 'Token required' };
    }

    // Format: Bearer <token>
    const token = authorization.split(' ')[1];
    if (!token) {
      throw { name: 'Unauthorized', message: 'Invalid token format' };
    }

    // Verifikasi token
    const payload = verifyToken(token);
    
    // Cek apakah user masih ada di database
    const user = await User.findByPk(payload.id);
    if (!user) {
      throw { name: 'Unauthorized', message: 'User not found' };
    }

    // Simpan data user di req.user untuk digunakan di controller
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;