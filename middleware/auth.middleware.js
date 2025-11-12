// backend/middleware/auth.middleware.js
const admin = require('../config/firebaseAdmin');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);

      req.user = {
        id: decodedToken.uid,
        email: decodedToken.email,
      };

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
