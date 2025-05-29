const { createTestUser } = require('../helpers');
const authentication = require('../../middlewares/authentication');
const { User } = require('../../models');
const { verifyToken } = require('../../helpers/jwt');

// Tambahkan mock untuk jwt dan User model
jest.mock('../../helpers/jwt', () => ({
  verifyToken: jest.fn()
}));

jest.mock('../../models', () => ({
  User: {
    findByPk: jest.fn()
  }
}));

describe('Authentication Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock Express request, response, and next function
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should set req.user when valid token is provided', async () => {
    // Setup
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      username: 'testuser'
    };
    
    req.headers.authorization = 'Bearer valid-token';
    verifyToken.mockReturnValue({ id: 1 });
    User.findByPk.mockResolvedValue(mockUser);
    
    // Execute
    await authentication(req, res, next);
    
    // Assert
    expect(verifyToken).toHaveBeenCalledWith('valid-token');
    expect(User.findByPk).toHaveBeenCalledWith(1);
    expect(req.user).toEqual({
      id: 1,
      email: 'test@example.com',
      username: 'testuser'
    });
    expect(next).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalledWith(expect.any(Object));
  });
  
  it('should call next with error when no authorization header', async () => {
    // Execute
    await authentication(req, res, next);
    
    // Assert
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Unauthorized',
      message: 'Token required'
    }));
  });
  
  it('should call next with error when token format is invalid', async () => {
    // Setup
    req.headers.authorization = 'InvalidFormat';
    
    // Execute
    await authentication(req, res, next);
    
    // Assert
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Unauthorized',
      message: 'Invalid token format'
    }));
  });
  
  it('should call next with error when user not found', async () => {
    // Setup
    req.headers.authorization = 'Bearer valid-token';
    verifyToken.mockReturnValue({ id: 999 }); // Non-existent user ID
    User.findByPk.mockResolvedValue(null);
    
    // Execute
    await authentication(req, res, next);
    
    // Assert
    expect(verifyToken).toHaveBeenCalledWith('valid-token');
    expect(User.findByPk).toHaveBeenCalledWith(999);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Unauthorized',
      message: 'User not found'
    }));
  });
  
  it('should call next with error when token verification fails', async () => {
    // Setup
    req.headers.authorization = 'Bearer invalid-token';
    const tokenError = new Error('Token verification failed');
    tokenError.name = 'JsonWebTokenError';
    verifyToken.mockImplementation(() => {
      throw tokenError;
    });
    
    // Execute
    await authentication(req, res, next);
    
    // Assert
    expect(verifyToken).toHaveBeenCalledWith('invalid-token');
    expect(next).toHaveBeenCalledWith(tokenError);
  });
});