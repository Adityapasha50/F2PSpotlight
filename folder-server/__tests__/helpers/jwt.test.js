const { generateToken, verifyToken } = require('../../helpers/jwt');
const jwt = require('jsonwebtoken');

// Mock jwt untuk pengujian
jest.mock('jsonwebtoken');

describe('JWT Helper', () => {
  beforeEach(() => {
    // Reset semua mock sebelum setiap pengujian
    jest.clearAllMocks();
  });
  
  describe('generateToken', () => {
    it('should call jwt.sign with correct parameters', () => {
      // Setup mock untuk jwt.sign
      jwt.sign.mockReturnValue('mock-token');
      
      const payload = { id: 1, email: 'test@example.com' };
      const token = generateToken(payload);
      
      // Verifikasi jwt.sign dipanggil dengan parameter yang benar
      expect(jwt.sign).toHaveBeenCalledWith(
        payload,
        expect.any(String),
        { expiresIn: '24h' }
      );
      
      // Verifikasi token yang dikembalikan
      expect(token).toBe('mock-token');
    });
  });
  
  describe('verifyToken', () => {
    it('should call jwt.verify with correct parameters', () => {
      // Setup mock untuk jwt.verify
      const mockPayload = { id: 1, email: 'test@example.com' };
      jwt.verify.mockReturnValue(mockPayload);
      
      const token = 'test-token';
      const result = verifyToken(token);
      
      // Verifikasi jwt.verify dipanggil dengan parameter yang benar
      expect(jwt.verify).toHaveBeenCalledWith(
        token,
        expect.any(String)
      );
      
      // Verifikasi payload yang dikembalikan
      expect(result).toEqual(mockPayload);
    });
    
    it('should throw an error for invalid token', () => {
      // Setup mock untuk jwt.verify agar melempar error
      const errorMessage = 'invalid token';
      jwt.verify.mockImplementation(() => {
        throw new Error(errorMessage);
      });
      
      const token = 'invalid-token';
      
      // Verifikasi bahwa error dilempar
      expect(() => {
        verifyToken(token);
      }).toThrow();
    });
  });
  
  // Tambahkan pengujian ini di dalam describe('JWT Helper')
  describe('JWT_SECRET fallback', () => {
    const originalEnv = process.env;
    
    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
      // Reset jwt mock
      jest.clearAllMocks();
    });
    
    afterEach(() => {
      process.env = originalEnv;
    });
    
    it('should use environment variable when available', () => {
      // Set environment variable
      process.env.JWT_SECRET = 'test-secret';
      
      // Re-require jwt module to use updated environment
      const jwtHelper = require('../../helpers/jwt');
      
      // Setup mock
      jwt.sign.mockReturnValue('env-token');
      
      // Generate token
      const token = jwtHelper.generateToken({ id: 1 });
      
      // Verify jwt.sign was called with the environment variable
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 1 },
        'test-secret',
        { expiresIn: '24h' }
      );
      
      expect(token).toBeDefined();
    });
    
    it('should use fallback value when environment variable is not available', () => {
      // Ensure environment variable is not set
      delete process.env.JWT_SECRET;
      
      // Re-require jwt module to use updated environment
      const jwtHelper = require('../../helpers/jwt');
      
      // Setup mock
      jwt.sign.mockReturnValue('fallback-token');
      
      // Generate token
      const token = jwtHelper.generateToken({ id: 1 });
      
      // Verify jwt.sign was called with the fallback value
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 1 },
        'rahasia',
        { expiresIn: '24h' }
      );
      
      expect(token).toBeDefined();
    });
  });
});