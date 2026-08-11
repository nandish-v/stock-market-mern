const express=require('express'); const {protect}=require('../middleware/auth'); const controller=require('../controllers/tradeController');
const router=express.Router(); router.use(protect); router.post('/buy',controller.buy); router.post('/sell',controller.sell); module.exports=router;
