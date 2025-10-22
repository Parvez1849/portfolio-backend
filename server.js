// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const portfolioRoutes = require('./routes/portfolio.routes');
const authRoutes = require('./routes/auth.routes'); 

// Load environment variables (reads from .env file)
dotenv.config();

// Connect to MongoDB (Ensure this is handled with async/await internally if needed)
connectDB();

// Initialize Express app
const app = express();

// --- CORS Configuration ---
const allowedOrigins = [
  process.env.FRONTEND_URL, // Your deployed frontend URL (from Vercel Env)
  'http://localhost:5173'  // Your local frontend development URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
// --- End CORS Configuration ---


// --- Middlewares ---
app.use(express.json());
// --- End Middlewares ---


// --- API Routes ---
app.use('/api/portfolios', portfolioRoutes); // Handle portfolio related routes
app.use('/api/auth', authRoutes);          // Handle authentication routes
// --- End API Routes ---


// Vercel Serverless Export:
// Vercel is file ko import karke app instance leta hai.
module.exports = app; 


// --- Local Server Setup (Conditional Listening) ---
// Yeh check karta hai ki kya file seedhe 'node server.js' se run ho rahi hai.
if (require.main === module) {
    // Get port from environment variable or use 5001 as default
    const PORT = process.env.PORT || 5001;

    // Start the server ONLY if it's running locally
    app.listen(PORT, () => {
        console.log(`✅ Server is running locally on http://localhost:${PORT}`);
    });
}
// --- End Local Server Setup ---