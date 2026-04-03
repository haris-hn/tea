const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbacksecret');
      req.user = await User.findById(decoded.userId).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (req.user.isBlocked) {
        console.warn(`[AUTH] Access denied: User ${req.user._id} is blocked.`);
        return res.status(403).json({ message: 'Your account has been blocked.' });
      }
      
      return next();
    } catch (error) {
      console.error('[AUTH] Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    console.warn('[AUTH] Access denied: No token provided');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    next();
  } else {
    console.warn(`[AUTH] Admin access denied for user: ${req.user?._id} with role: ${req.user?.role}`);
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

const superAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a superadmin' });
  }
};

module.exports = { protect, admin, superAdmin };
