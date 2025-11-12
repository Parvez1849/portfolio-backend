const admin = require('firebase-admin');

// ----------------------------
// Firebase Admin Initialization
// ----------------------------
let firebaseApp;

try {
  // Check agar already initialize ho chuka hai toh reuse karo
  firebaseApp = admin.getApp();
  console.log('✅ Firebase Admin already initialized, reusing the app.');
} catch (error) {
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID, // Replace with your project_id
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID, // optional, can be empty
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Replace \n
    client_email: process.env.FIREBASE_CLIENT_EMAIL, // Replace with your client_email
    client_id: process.env.FIREBASE_CLIENT_ID, // optional, can be empty
    auth_uri: process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
    token_uri: process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL, // Replace with your client_x509_cert_url
  };

  if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
    throw new Error("Firebase Admin initialization failed: missing project_id, client_email, or private_key");
  }

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log('✅ Firebase Admin SDK initialized successfully.');
}

module.exports = firebaseApp;

