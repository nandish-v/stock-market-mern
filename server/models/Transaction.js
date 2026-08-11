const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  symbol: { type: String, required: true, uppercase: true, trim: true },
  type: { type: String, enum: ['BUY', 'SELL'], required: true },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  profitLoss: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now, index: true }
});
module.exports = mongoose.model('Transaction', transactionSchema);
