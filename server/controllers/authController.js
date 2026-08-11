const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

function tokenFor(user) {
  return jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}
function payload(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role, virtualCash: user.virtualCash };
}
function validate(req, res) { const errors = validationResult(req); if (!errors.isEmpty()) { res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() }); return false; } return true; }

async function register(req, res, next) {
  try {
    if (!validate(req, res)) return;
    const { name, email, password } = req.body;
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ success: false, message: 'Email is already registered' });
    const user = await User.create({ name, email: email.toLowerCase(), password: await bcrypt.hash(password, 12) });
    res.status(201).json({ success: true, message: 'Registration successful', token: tokenFor(user), user: payload(user) });
  } catch (error) { next(error); }
}

async function login(req, res, next) {
  try {
    if (!validate(req, res)) return;
    const user = await User.findOne({ email: req.body.email.toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    res.json({ success: true, message: 'Login successful', token: tokenFor(user), user: payload(user) });
  } catch (error) { next(error); }
}

async function me(req, res) { res.json({ success: true, user: payload(req.user) }); }
module.exports = { register, login, me };
