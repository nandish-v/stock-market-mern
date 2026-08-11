const User = require('../models/User');
const Holding = require('../models/Holding');
const Transaction = require('../models/Transaction');
const market = require('./marketService');

async function valuedHoldings(userId) {
  const holdings = await Holding.find({ userId }).sort({ totalInvested: -1 }).lean();
  return Promise.all(holdings.map(async (holding) => {
    let currentPrice = 0; let quoteError = false;
    try { const quote = await market.quote(holding.symbol); currentPrice = Number(quote.price || quote.close) || 0; } catch (error) { quoteError = true; }
    const currentValue = Number((holding.quantity * currentPrice).toFixed(2));
    const unrealizedPL = Number((currentValue - holding.totalInvested).toFixed(2));
    return { ...holding, currentPrice, currentValue, unrealizedPL, quoteError, returnPercent: holding.totalInvested ? Number(((unrealizedPL / holding.totalInvested) * 100).toFixed(2)) : 0 };
  }));
}
async function portfolio(userId) {
  const user = await User.findById(userId).lean();
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
  const holdings = await valuedHoldings(userId);
  const currentValue = Number(holdings.reduce((sum, item) => sum + item.currentValue, 0).toFixed(2));
  const investedAmount = Number(holdings.reduce((sum, item) => sum + item.totalInvested, 0).toFixed(2));
  const unrealizedPL = Number((currentValue - investedAmount).toFixed(2));
  return { cash: user.virtualCash, investedAmount, currentValue, unrealizedPL, totalAccountValue: Number((user.virtualCash + currentValue).toFixed(2)), holdings };
}
async function dashboard(userId) {
  const summary = await portfolio(userId);
  const recentTransactions = await Transaction.find({ userId }).sort({ createdAt: -1 }).limit(5).lean();
  return { ...summary, recentTransactions };
}
module.exports = { portfolio, dashboard };
