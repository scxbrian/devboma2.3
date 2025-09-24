const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authenticate token middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token or user not found' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({ 
      success: false,
      error: 'Invalid or expired token' 
    });
  }
};

// Admin only middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      error: 'Admin access required' 
    });
  }
  next();
};

// Client access middleware (can access own data or admin can access all)
const requireClientAccess = (req, res, next) => {
  const { clientId } = req.params;
  
  if (req.user.role === 'admin') {
    return next();
  }
  
  if (req.user.role === 'client' && req.user.clientId && req.user.clientId.toString() === clientId) {
    return next();
  }
  
  return res.status(403).json({ 
    success: false,
    error: 'Access denied to this client data' 
  });
};

// Multi-tenant middleware - ensures data isolation
const checkTenantAccess = (req, res, next) => {
  const { clientId } = req.params;
  
  if (!clientId && req.user.role !== 'admin') {
    return res.status(400).json({ 
      success: false,
      error: 'Client ID required' 
    });
  }
  
  if (req.user.role === 'client' && req.user.clientId && req.user.clientId.toString() !== clientId) {
    return res.status(403).json({ 
      success: false,
      error: 'Access denied to this client data' 
    });
  }
  
  req.clientId = clientId || req.user.clientId;
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireClientAccess,
  checkTenantAccess
};