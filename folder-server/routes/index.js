const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const gameController = require('../controllers/gameController');
const favoriteController = require('../controllers/favoriteController');
const transactionController = require('../controllers/transactionController');
const geminiController = require('../controllers/geminiController');
const authentication = require('../middlewares/authentication');

// ========== User Routes ==========
router.post('/users/register', userController.register);
router.post('/users/login', userController.login);
router.post('/users/login/google', userController.googleLogin);

router.get('/users/profile', authentication, userController.getProfile);
router.put('/users/profile', authentication, userController.updateProfile);

// ========== Game Routes ==========
router.get('/games', gameController.getAllGames);
router.get('/games/category/:category', gameController.getByCategory);
router.get('/games/popular/:genre', geminiController.getPopularGame);
router.get('/games/popular-simple/:genre', geminiController.getPopularGameSimple);
router.get('/games/:id', gameController.getGameById);

// ========== Favorites (Require Auth) ==========
router.use('/favorites', authentication);
router.get('/favorites', favoriteController.getFavorites);
router.post('/favorites/:gameId', favoriteController.addFavorite);
router.delete('/favorites/:gameId', favoriteController.removeFavorite);

// ========== Transactions ==========
router.post('/transactions', authentication, transactionController.createTransaction);
router.get('/transactions', authentication, transactionController.getUserTransactions);
router.get('/transactions/:id', authentication, transactionController.getTransactionStatus);
// Hapus endpoint notifikasi Midtrans
// router.post('/transactions/notification', transactionController.handleNotification); 

// Tambahkan route ini
router.get('/test-gemini', geminiController.testGeminiAPI);

module.exports = router;
