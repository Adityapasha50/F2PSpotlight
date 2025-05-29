const { hashPassword, comparePassword } = require('../../helpers/bcrypt');

describe('Bcrypt Helper', () => {
  describe('hashPassword', () => {
    it('should hash a password correctly', () => {
      const password = 'password123';
      const hashedPassword = hashPassword(password);
      
      // Pastikan hasil hash berbeda dengan password asli
      expect(hashedPassword).not.toBe(password);
      
      // Pastikan hasil hash adalah string
      expect(typeof hashedPassword).toBe('string');
      
      // Pastikan hasil hash memiliki format bcrypt yang benar (dimulai dengan $2a$ atau $2b$)
      expect(hashedPassword.startsWith('$2a$') || hashedPassword.startsWith('$2b$')).toBe(true);
    });
    
    it('should generate different hashes for the same password', () => {
      const password = 'password123';
      const hash1 = hashPassword(password);
      const hash2 = hashPassword(password);
      
      // Pastikan dua hash dari password yang sama menghasilkan nilai yang berbeda
      expect(hash1).not.toBe(hash2);
    });
  });
  
  describe('comparePassword', () => {
    it('should return true for matching password and hash', () => {
      const password = 'password123';
      const hashedPassword = hashPassword(password);
      
      const result = comparePassword(password, hashedPassword);
      expect(result).toBe(true);
    });
    
    it('should return false for non-matching password and hash', () => {
      const password = 'password123';
      const wrongPassword = 'wrongpassword';
      const hashedPassword = hashPassword(password);
      
      const result = comparePassword(wrongPassword, hashedPassword);
      expect(result).toBe(false);
    });
  });
});