const User = require('../models/User');
const Holding = require('../models/Holding');
const Transaction = require('../models/Transaction');
const market = require('./marketService');

function quantity(value) { return Number.isInteger(value) && value > 0; }
function priceFromQuote(quote) { const value = Number(quote.price || quote.close); return Number.isFinite(value) && value > 0 ? value : null; }

async function trade({ userId, symbol, requestedQuantity, type }) {
  const qty = Number(requestedQuantity); const normalized = String(symbol || '').trim().toUpperCase();
  if (!/^[A-Z0-9.:-]{1,20}$/.test(normalized)) throw Object.assign(new Error('Invalid stock symbol'), { statusCode: 400 });
  if (!quantity(qty)) throw Object.assign(new Error('Quantity must be a positive whole number'), { statusCode: 400 });
  const price = priceFromQuote(await market.quote(normalized));
  if (!price) throw Object.assign(new Error('Market provider returned no tradable price'), { statusCode: 502 });
  const total = Number((price * qty).toFixed(2));
  const user = await User.findById(userId);
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
  let holding = await Holding.findOne({ userId, symbol: normalized });
  let profitLoss = 0;
  if (type === 'BUY') {
    if (user.virtualCash < total) throw Object.assign(new Error('Insufficient virtual cash'), { statusCode: 400 });
    const oldQty = holding?.quantity || 0; const oldInvested = holding?.totalInvested || 0;
    user.virtualCash = Number((user.virtualCash - total).toFixed(2));
    if (holding) { holding.quantity = oldQty + qty; holding.totalInvested = Number((oldInvested + total).toFixed(2)); holding.averageBuyPrice = holding.totalInvested / holding.quantity; }
    else holding = new Holding({ userId, symbol: normalized, quantity: qty, totalInvested: total, averageBuyPrice: price });
  } else {
    if (!holding || holding.quantity < qty) throw Object.assign(new Error('Insufficient holdings to sell'), { statusCode: 400 });
    profitLoss = Number(((price - holding.averageBuyPrice) * qty).toFixed(2));
    user.virtualCash = Number((user.virtualCash + total).toFixed(2));
    const investedSold = holding.averageBuyPrice * qty; holding.quantity -= qty; holding.totalInvested = Number(Math.max(0, holding.totalInvested - investedSold).toFixed(2));
    if (holding.quantity === 0) await holding.deleteOne();
    else { holding.averageBuyPrice = holding.totalInvested / holding.quantity; await holding.save(); }
  }
  await user.save();
  if (type === 'BUY') await holding.save();
  const transaction = await Transaction.create({ userId, symbol: normalized, type, quantity: qty, price, totalAmount: total, profitLoss });
  return { transaction, balance: user.virtualCash, holding: type === 'SELL' && (!holding || holding.quantity === 0) ? null : holding };
}
module.exports = { trade };
