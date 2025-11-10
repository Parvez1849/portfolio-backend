// backend/middleware/auth.middleware.js
const admin = require('firebase-admin'); // Firebase Admin ka istemal karein

exports.protect = async (req, res, next) => {
  let token;

  // Header se 'Bearer' token lein
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Token ko 'firebase-admin' se verify karein
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      // Token verify ho gaya, user ki Firebase ID (uid) ko req.user mein add karein
      req.user = {
        id: decodedToken.uid, // Yeh ab Firebase ki UID (String) hai
        email: decodedToken.email
      };
      
      next(); // Controller par aage bhein
    } catch (error) {
      // Agar token invalid hai (expire ho gaya hai ya galat hai)
      console.error('Firebase token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // Agar header mein token hi nahi hai
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};