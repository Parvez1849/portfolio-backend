// backend/config/firebaseAdmin.js
const admin = require('firebase-admin');

let firebaseApp;

try {
  // Check if already initialized
  firebaseApp = admin.getApp();
} catch (error) {
  // Initialize only if not already initialized
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    throw new Error(
      "Firebase Admin initialization failed: missing project_id, client_email, or private_key"
    );
  }

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });

  console.log("✅ Firebase Admin initialized successfully.");
}

module.exports = admin;
