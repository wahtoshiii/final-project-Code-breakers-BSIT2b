const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // Look for the token in the headers
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // If no token is found, move on (treat them as a visitor)
    if (!token) {
        req.user = null;
        return next();
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            req.user = null;
        } else {
            req.user = user; // Attach the decoded user (with their role) to the request
        }
        next();
    });
};

module.exports = { authenticateToken };