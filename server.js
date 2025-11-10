// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const portfolioRoutes = require('./routes/portfolio.routes');

// Firebase Admin SDK import karein
const admin = require('firebase-admin');

try {
  // Check karein ki file load ho rahi hai ya nahi
  const serviceAccount = require('./config/serviceAccountKey.json');
  console.log("✅ serviceAccountKey.json loaded successfully.");

  // Firebase Admin ko initialize karein
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("✅ Firebase Admin SDK initialized successfully.");

} catch (error) {
  console.error("❌ FAILED TO INITIALIZE FIREBASE ADMIN SDK ❌");
  console.error("Error details:", error.message);
  console.error("Please ensure 'backend/config/serviceAccountKey.json' file exists and is correct.");
  process.exit(1); 
}

dotenv.config();
connectDB();
const app = express();

// CORS configuration
const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.trim() : null;
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
];
if (frontendUrl) {
    allowedOrigins.push(frontendUrl);
}

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parser
app.use(express.json());

// API Routes
app.use('/api/portfolios', portfolioRoutes);
// Purana '/api/auth' route yahaan se HATA diya gaya hai

// Server Setup
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
