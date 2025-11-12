// backend/middleware/auth.middleware.js
const admin = require('../config/firebaseAdmin'); // Firebase admin ko import karein

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    try {
      // Token ko Firebase se verify karein
      const decodedToken = await admin.auth().verifyIdToken(token);

      // Firebase ki 'uid' ko req.user.id mein store karein
      req.user = {
        id: decodedToken.uid,
        email: decodedToken.email,
      };
      
      // Agar sab sahi hai, toh agle step (controller) par jaane dein
      return next();

    } catch (error) {
      // Agar token galat hai (expired, ya verify nahi hua)
      console.error("Firebase token verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    // Agar token header mein hai hi nahi
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
