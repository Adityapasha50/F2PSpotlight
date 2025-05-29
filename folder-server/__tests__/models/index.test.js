const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

describe('Models/index', () => {
  // Simpan nilai asli process.env
  const originalNodeEnv = process.env.NODE_ENV;
  const originalUseEnvVariable = process.env.use_env_variable;
  
  afterEach(() => {
    // Kembalikan nilai asli setelah setiap test
    process.env.NODE_ENV = originalNodeEnv;
    process.env.use_env_variable = originalUseEnvVariable;
    jest.resetModules();
  });
  
  it('should use the development environment by default', () => {
    // Hapus NODE_ENV untuk menguji fallback ke 'development'
    delete process.env.NODE_ENV;
    
    // Import models/index.js setelah mengubah environment
    const db = require('../../models');
    
    expect(db).toBeDefined();
    expect(db.sequelize).toBeInstanceOf(Sequelize);
  });
  
  it('should use environment variable for database connection when specified', () => {
    // Set use_env_variable
    process.env.use_env_variable = 'DATABASE_URL';
    process.env.DATABASE_URL = 'postgres://user:pass@localhost:5432/testdb';
    
    // Import models/index.js setelah mengubah environment
    const db = require('../../models');
    
    expect(db).toBeDefined();
    expect(db.sequelize).toBeInstanceOf(Sequelize);
  });
  
  it('should call associate method if it exists', () => {
    // Mock fs.readdirSync untuk mengembalikan file model buatan
    jest.spyOn(fs, 'readdirSync').mockReturnValue(['mockModel.js']);
    
    // Mock path.join untuk mengembalikan path yang valid
    jest.spyOn(path, 'join').mockReturnValue(path.join(__dirname, 'mockModel.js'));
    
    // Mock require untuk mengembalikan model buatan dengan method associate
    const mockModel = function(sequelize, DataTypes) {
      return {
        name: 'MockModel',
        associate: jest.fn()
      };
    };
    jest.mock(path.join(__dirname, 'mockModel.js'), () => mockModel, { virtual: true });
    
    // Import models/index.js
    const db = require('../../models');
    
    // Verifikasi bahwa associate dipanggil
    expect(db.MockModel.associate).toHaveBeenCalled();
  });
});