// backend/controllers/portfolio.controller.js
const Portfolio = require('../models/portfolio.model');
const mongoose = require('mongoose');

// @desc    Create a new portfolio (Protected)
const createPortfolio = async (req, res) => {
    try {
        const portfolioData = { ...req.body, userId: req.user.id };
        const newPortfolio = new Portfolio(portfolioData);
        await newPortfolio.save();
        res.status(201).json(newPortfolio);
    } catch (error) {
        console.error("Create Portfolio Error:", error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get ALL portfolios (Public Route)
const getAllPublicPortfolios = async (req, res) => {
    try {
        const portfolios = await Portfolio.find().sort({ createdAt: -1 });
        res.status(200).json(portfolios);
    } catch (error) {
        console.error("Get All Public Portfolios Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get ONLY the logged-in user's portfolios (Protected Route)
const getMyPortfolios = async (req, res) => {
    try {
        const portfolios = await Portfolio.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(portfolios);
    } catch (error) {
        console.error("Get My Portfolios Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single portfolio by ID (Public Route)
const getPortfolioById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Portfolio ID format' });
        }
        const portfolio = await Portfolio.findById(req.params.id);
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }
        res.status(200).json(portfolio);
    } catch (error) {
        console.error("Get Portfolio By ID Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a portfolio (Protected)
const updatePortfolio = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Portfolio ID format' });
        }

        console.log("--- Update Request Received ---"); // Log 1
        console.log("Incoming Body Data (req.body):", JSON.stringify(req.body, null, 2));

        // 1. Fetch the existing portfolio
        let portfolio = await Portfolio.findById(req.params.id);
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        // 2. Check authorization
        if (portfolio.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'User not authorized' });
        }

        // --- **DOT NOTATION UPDATE** ---
        const updateData = req.body;

        // Ensure nested objects exist if they don't (Mongoose might create them on assignment)
        portfolio.basic = portfolio.basic || {};
        portfolio.hero = portfolio.hero || {};
        portfolio.about = portfolio.about || {};
        portfolio.contact = portfolio.contact || {};

        // Iterate through incoming data and set fields using dot notation
        for (const key in updateData) {
            if (updateData.hasOwnProperty(key)) {
                if (['basic', 'hero', 'about', 'contact'].includes(key) && typeof updateData[key] === 'object' && updateData[key] !== null) {
                    // For nested objects, iterate through their keys
                    for (const subKey in updateData[key]) {
                        if (updateData[key].hasOwnProperty(subKey)) {
                            // Use dot notation: portfolio.hero.name = updateData.hero.name
                            portfolio[key][subKey] = updateData[key][subKey];
                        }
                    }
                } else if (['skills', 'services', 'projects', 'testimonials'].includes(key)) {
                    // For arrays, replace the whole array
                    portfolio[key] = updateData[key];
                } else if (key === 'templateId') {
                    // For direct fields
                    portfolio[key] = updateData[key];
                }
                // We ignore _id, userId, createdAt, etc. from req.body
            }
        }
        // --- **END DOT NOTATION UPDATE** ---

        console.log("Portfolio Data AFTER Dot Assignment (Before Save):", JSON.stringify(portfolio.toObject ? portfolio.toObject() : portfolio, null, 2)); // Log 3

        // 4. Save the updated document
        const savedPortfolio = await portfolio.save();

        console.log("--- Update Successful ---");
        res.status(200).json(savedPortfolio);

    } catch (error) {
        console.error("--- Update Portfolio Error ---:", error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join('. ') });
        }
        res.status(400).json({ message: error.message || "Update failed" });
    }
};

// @desc    Delete a portfolio (Protected)
const deletePortfolio = async (req, res) => {
   // ... delete logic remains the same ...
   try {
     if (!mongoose.Types.ObjectId.isValid(req.params.id)) { /* ... */ }
    const portfolioDoc = await Portfolio.findById(req.params.id);
    if (!portfolioDoc) return res.status(404).json({ message: 'Portfolio not found' });
     if (portfolioDoc.userId.toString() !== req.user.id) { /* ... */ }
    await Portfolio.findByIdAndDelete(req.params.id);
    console.log("--- Delete Successful --- for ID:", req.params.id);
    res.status(200).json({ message: 'Portfolio deleted successfully' });
  } catch (error) { /* ... */ }
};

module.exports = {
    createPortfolio,
    getAllPublicPortfolios,
    getMyPortfolios,
    getPortfolioById,
    updatePortfolio,
    deletePortfolio,
};