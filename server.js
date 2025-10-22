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


// --- CORS Configuration (Optimized for Production & Local) ---
// FRONTEND_URL को ट्रिम करें ताकि कोई स्पेस न रहे और यह एक स्ट्रिंग के रूप में हो
const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.trim() : null;

// Allowed Origins की लिस्ट
const allowedOrigins = [
  'http://localhost:5173', // Local frontend development URL (http)
  'http://localhost:3000', // Other common local port
];

// Production URL जोड़ें, अगर यह सेट है
if (frontendUrl) {
    // Netlify हमेशा HTTPS होता है, इसलिए HTTPS URL जोड़ना ज़रूरी है
    allowedOrigins.push(frontendUrl);
    // यह सुनिश्चित करने के लिए कि WWW और NON-WWW दोनों काम करें, एक और संभावित डोमेन भी जोड़ सकते हैं
    // जैसे: 'https://www.netlify.app'
}


app.use(cors({
  origin: function (origin, callback) {
    // origin undefined होता है जब यह local/server-to-server call होती है (जैसे Postman)
    // या जब यह Allowed Origins में हो
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // console.error(`CORS Blocked: Request from ${origin} not allowed.`);
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
module.exports = app; 


// --- Local Server Setup (Conditional Listening) ---
if (require.main === module) {
    // Get port from environment variable or use 5001 as default
    const PORT = process.env.PORT || 5001;

    // Start the server ONLY if it's running locally
    app.listen(PORT, () => {
        console.log(`✅ Server is running locally on http://localhost:${PORT}`);
    });
}
// --- End Local Server Setup ---