const mongoose = require('mongoose');
const holdingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  symbol: { type: String, required: true, uppercase: true, trim: true },
  quantity: { type: Number, required: true, min: 0 },
  averageBuyPrice: { type: Number, required: true, min: 0 },
  totalInvested: { type: Number, required: true, min: 0 }
}, { timestamps: true });
holdingSchema.index({ userId: 1, symbol: 1 }, { unique: true });
module.exports = mongoose.model('Holding', holdingSchema);
