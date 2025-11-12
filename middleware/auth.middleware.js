// backend/middleware/auth.middleware.js
const admin = require('../config/firebaseAdmin'); // Firebase admin ko import karein

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    try {
      // --- YAHI SAHI CODE HAI ---
      // Token ko Firebase se verify karein
      const decodedToken = await admin.auth().verifyIdToken(token);

      // Firebase ki 'uid' ko req.user.id mein store karein
      req.user = {
        id: decodedToken.uid,
        email: decodedToken.email,
      };
      // --- END ---

      return next();
    } catch (error) {
      console.error("Firebase token verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
