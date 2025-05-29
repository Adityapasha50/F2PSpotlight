const { Transaction, User, Game } = require('../models');
// Hapus baris ini:
// const { snap } = require('../helpers/midtrans');
const { v4: uuidv4 } = require('uuid'); 

class TransactionController {
  static async createTransaction(req, res, next) {
    try {
      const { amount, gameId } = req.body;
      const userId = req.user.id;

      if (!amount || !gameId) {
        throw { name: 'BadRequest', message: 'Amount and gameId are required' };
      }
      
      const game = await Game.findByPk(gameId);
      if (!game) {
        throw { name: 'NotFound', message: 'Game not found' };
      }
      
      const orderId = `GI-TOPUP-${uuidv4().substring(0, 8)}-${Date.now()}`;
      const user = await User.findByPk(userId);
      
      // Hapus parameter Midtrans
      // const parameter = { ... }
      
      const transaction = await Transaction.create({
        userId,
        gameId,
        amount: parseInt(amount),
        status: 'success', // Ubah dari 'pending' ke 'success' karena tidak ada proses pembayaran Midtrans
        orderId
      });
      
      // Hapus kode terkait snap token
      // const token = await snap.createTransaction(parameter);
      // await transaction.update({ snapToken: token.token });
      
      res.status(201).json({
        message: 'Transaction created',
        data: {
          transaction
          // Hapus token dan redirectUrl
        }
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async getTransactionStatus(req, res, next) {
    try {
      const { id } = req.params;
      
      const transaction = await Transaction.findByPk(id);
      if (!transaction) {
        throw { name: 'NotFound', message: 'Transaction not found' };
      }
      
      // Hapus kode untuk mengecek status di Midtrans
      // const status = await snap.transaction.status(transaction.orderId);
      // await transaction.update({ ... });
      
      res.status(200).json({
        message: 'Transaction status',
        data: {
          transaction
          // Hapus midtransStatus
        }
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Hapus atau modifikasi fungsi handleNotification
  // static async handleNotification(req, res, next) { ... }
  
  static async getUserTransactions(req, res, next) {
    try {
      const userId = req.user.id;
      
      const transactions = await Transaction.findAll({
        where: { userId },
        include: [{ model: Game, attributes: ['title', 'thumbnail'] }],
        order: [['createdAt', 'DESC']]
      });
      
      res.status(200).json({
        message: 'Transactions fetched successfully',
        data: transactions
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TransactionController;