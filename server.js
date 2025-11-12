require('dotenv').config(); // ✅ must be first
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const portfolioRoutes = require('./routes/portfolio.routes');
const admin = require('./config/firebaseAdmin'); // ✅ updated

// ----------------------------
// Connect MongoDB
// ----------------------------
connectDB();

// ----------------------------
// Express App
// ----------------------------
const app = express();

// ----------------------------
// CORS Configuration
// ----------------------------
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.options('*', cors());

// ----------------------------
// API Routes
// ----------------------------
app.use('/api/portfolios', portfolioRoutes);

// ----------------------------
// Test Route
// ----------------------------
app.get('/', (req, res) => {
  res.send('✅ Portfolio Backend is running successfully!');
});

// ----------------------------
// Start Server
// ----------------------------
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

