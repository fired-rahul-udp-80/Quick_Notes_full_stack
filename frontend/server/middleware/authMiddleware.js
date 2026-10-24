const jwt = require('jsonwebtoken');
const User = require('../models/User');

const extractToken = (req) => {
  if (req.cookies && req.cookies.accessToken) {
    return req.cookies.accessToken;
  }
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }
    return req.headers.authorization;
  }
  return null;
};

const authenticate = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please login to continue.'
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Access token expired',
          isTokenExpired: true
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token'
      });
    }

    // Check if user exists and is active
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account not found or deactivated'
      });
    }

    // Attach user payload to request
    req.user = {
      _id: user._id,
      userId: user._id,  
      role: user.role,
      email: user.email,
      name: user.name,
      academicProfile: user.academicProfile,
      isVerified: user.isVerified
    };

    req.userDoc = user;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

 

const optionalAuthenticate = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.userId);
      if (user && user.isActive) {
        req.user = {
          userId: user._id,
          role: user.role,
          email: user.email,
          name: user.name,
          academicProfile: user.academicProfile,
          isVerified: user.isVerified
        };
        req.userDoc = user;
      }
    } catch (e) {
      // Token expired or invalid; proceed as unauthenticated visitor
    }

    next();
  } catch (error) {
    next();
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to access this resource.'
      });
    }
    next();
  };
};

module.exports = {
  authenticate,
  optionalAuthenticate,
  authorizeRoles
};

