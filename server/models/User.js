const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  virtualCash: { type: Number, default: 1000000, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
