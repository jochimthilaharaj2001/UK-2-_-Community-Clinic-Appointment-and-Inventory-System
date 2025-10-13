// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

function authGuard(req, res, next) {
  const header = req.headers.authorization || req.cookies?.token;
  if (!header) return res.status(401).json({ message: 'Missing Authorization header' });
  const token = header.split(' ')[1] || header;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function requireAnyRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if (roles.includes(req.user.role) || req.user.role === 'admin') return next();
    return res.status(403).json({ message: 'Forbidden' });
  };
}

module.exports = { authGuard, requireAnyRole };
