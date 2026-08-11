const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Holding = require('../models/Holding');
const { portfolio, dashboard } = require('../services/portfolioService');
async function getDashboard(req,res,next){try{res.json({success:true,data:await dashboard(req.user._id)})}catch(e){next(e)}}
async function getPortfolio(req,res,next){try{res.json({success:true,data:await portfolio(req.user._id)})}catch(e){next(e)}}
async function getTransactions(req,res,next){try{const limit=Math.min(Number(req.query.limit)||50,200);const query={userId:req.user._id};if(req.query.type && ['BUY','SELL'].includes(req.query.type))query.type=req.query.type;const transactions=await Transaction.find(query).sort({createdAt:-1}).limit(limit).lean();res.json({success:true,data:transactions})}catch(e){next(e)}}
async function getHoldings(req,res,next){try{const holdings=await Holding.find({userId:req.user._id}).sort({createdAt:-1}).lean();res.json({success:true,data:holdings})}catch(e){next(e)}}
module.exports={getDashboard,getPortfolio,getTransactions,getHoldings};
