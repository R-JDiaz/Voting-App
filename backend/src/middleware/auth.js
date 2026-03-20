const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
    req.user = user;
    next();
  });
};

const authorizePermission = (...allowedRoles) => {
  return (req, res, next) => {
    console.log('User in authorizePermission:', req.user);
    // 1. Ensure user is authenticated
    console.log(req.user);
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    // 2. Allow if user's role is in allowedRoles
    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    console.log(req.user);
    // 3. Allow if user can create elections
    if (Boolean(req.user.can_create_election)) return next();

    // 4. Otherwise, deny access
    return res.status(403).json({ 
      success: false, 
      message: 'Insufficient permissions. Admin access or election creation rights required.' 
    });
  };
};



const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions. Admin access required.' 
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole,
  authorizePermission
};
