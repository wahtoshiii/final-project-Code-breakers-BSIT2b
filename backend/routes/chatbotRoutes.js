const express = require('express');
const router = express.Router();
const { handleChatMessage } = require('../controllers/chatbotController');
//const { authenticateToken } = require('../middleware/authMiddleware');

// We make authenticateToken optional here. 
const optionalAuth = (req, res, next) => {
    authenticateToken(req, res, (err) => {
        if (err) req.user = null; // Ignore error, treat as guest/visitor
        next();
    });
};

router.post('/ask', handleChatMessage);

module.exports = router;