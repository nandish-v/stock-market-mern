require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/market', require('./routes/marketRoutes'));
app.use('/api/trade', require('./routes/tradeRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/user/watchlist', require('./routes/watchlistRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Stock Market API is running' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

async function start() {
  try {
    await connectDB();
    app.listen(PORT, '0.0.0.0', () => console.log(`API listening on port ${PORT}`));
  } catch (error) {
    console.error(`Unable to start server: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) start();
module.exports = app;
