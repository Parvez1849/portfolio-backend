// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const portfolioRoutes = require('./routes/portfolio.routes');
const authRoutes = require('./routes/auth.routes'); // Auth Routes import

// Load environment variables (reads from .env file)
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// --- CORS Configuration ---
// Define allowed origins (where requests can come from)
const allowedOrigins = [
  process.env.FRONTEND_URL, // Your deployed frontend URL (from .env)
  'http://localhost:5173'  // Your local frontend development URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests) OR requests from allowed origins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Optional: If you plan to use cookies/sessions later
}));
// --- End CORS Configuration ---


// --- Middlewares ---
// Body parser to read JSON data from requests
app.use(express.json());
// --- End Middlewares ---


// --- API Routes ---
app.use('/api/portfolios', portfolioRoutes); // Handle portfolio related routes
app.use('/api/auth', authRoutes);          // Handle authentication routes
// --- End API Routes ---


// --- Server Setup ---
// Get port from environment variable or use 5001 as default
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
// --- End Server Setup ---