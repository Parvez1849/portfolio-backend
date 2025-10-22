// backend/routes/portfolio.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

const {
  createPortfolio,
  getAllPublicPortfolios, // We need this function exported
  getMyPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
} = require('../controllers/portfolio.controller');

// --- Public Routes ---
// NEW: Route for the public gallery (does NOT use 'protect')
router.route('/public').get(getAllPublicPortfolios); 

// Route to get a single portfolio by ID (remains public)
router.route('/:id').get(getPortfolioById);

// --- Protected Routes ---
router.route('/')
  .post(protect, createPortfolio); // Create needs login

// Route to get ONLY the logged-in user's portfolios
router.route('/my/list').get(protect, getMyPortfolios); 

router.route('/:id')
  .put(protect, updatePortfolio)    
  .delete(protect, deletePortfolio); 

module.exports = router;
