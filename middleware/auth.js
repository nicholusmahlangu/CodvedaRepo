const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key';

// Middleware to authenticate JWT tokens
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN           

    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden

        req.user = user; // Attach user info to request
        next(); // Proceed to the next middleware or route handler
    });
}

function authorizeRole(role) {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            res.status(403).json({ message: 'Access denied' });
        }
    };
}

module.exports = { authenticateToken, authorizeRole };