const { sequelize } = require('../models');

beforeAll(async () => {
  // Reset dan sync database untuk pengujian
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Tutup koneksi database setelah semua pengujian selesai
  await sequelize.close();
});