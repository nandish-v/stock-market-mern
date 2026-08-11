const { body, validationResult } = require('express-validator');
const { trade } = require('../services/tradeService');
function validation(req,res) { const errors=validationResult(req); if(!errors.isEmpty()){res.status(400).json({success:false,message:'Validation failed',errors:errors.array()});return false} return true; }
async function execute(type, req, res, next) { try { if(!validation(req,res)) return; const result=await trade({userId:req.user._id,symbol:req.body.symbol,requestedQuantity:req.body.quantity,type}); res.status(201).json({success:true,message:`${type} order executed`,data:result}); } catch(e){next(e)} }
const rules=[body('symbol').isString().trim().notEmpty().withMessage('Symbol is required'),body('quantity').isInt({min:1}).withMessage('Quantity must be a positive whole number')];
module.exports={buy:[...rules,(req,res,next)=>execute('BUY',req,res,next)],sell:[...rules,(req,res,next)=>execute('SELL',req,res,next)]};
