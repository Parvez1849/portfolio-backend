// backend/routes/auth.routes.js
const express = require('express');
const { register, login } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
// Hum 'getMe' (logged in user ki details) ke liye bhi route bana sakte hain

module.exports = router;