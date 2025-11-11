// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const portfolioRoutes = require('./routes/portfolio.routes');
const admin = require('firebase-admin');

// 🔹 Load environment variables
dotenv.config();

// 🔹 Firebase Admin Initialization from ENV (no JSON file needed)
try {
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("✅ Firebase Admin SDK initialized successfully from ENV.");
} catch (error) {
  console.error("❌ FAILED TO INITIALIZE FIREBASE ADMIN SDK ❌");
  console.error("Error details:", error.message);
}

// 🔹 Connect MongoDB
connectDB();

// 🔹 Express App
const app = express();

// 🔹 CORS Configuration
const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.trim() : null;
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
];
if (frontendUrl) {
  allowedOrigins.push(frontendUrl);
}

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://portfolio-five-inky-92.vercel.app',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// 🔹 Body Parser
app.use(express.json());

app.options('*', cors());

// 🔹 API Routes
app.use('/api/portfolios', portfolioRoutes);

// 🔹 Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

