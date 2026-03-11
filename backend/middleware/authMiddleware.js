const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes — only authenticated admins can access
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header has Bearer token
  // Header format: "Authorization: Bearer eyJhbGci..."
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify token with JWT_SECRET — throws error if expired or invalid
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user data to request (minus password)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Allow request to proceed
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
