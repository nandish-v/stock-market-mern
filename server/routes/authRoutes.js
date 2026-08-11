const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { register, login, me } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, standardHeaders: true, legacyHeaders: false, message: { success: false, message: 'Too many authentication attempts; try again later' } });
const email = body('email').isEmail().withMessage('A valid email is required').normalizeEmail();
router.post('/register', authLimiter, [body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters'), email, body('password').isLength({ min: 8, max: 128 }).withMessage('Password must be 8–128 characters')], register);
router.post('/login', authLimiter, [email, body('password').notEmpty().withMessage('Password is required')], login);
router.get('/me', protect, me);
module.exports = router;
