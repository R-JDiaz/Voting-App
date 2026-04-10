import { AppError } from '../utils/handlers/response_handler';
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

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

const isUser = (req) => {
  if (!req.user) {
      throw new AppError(
        'Request User are Required', 
        401,
        'REQUEST_USER_ARE_EMPTY'
    );
  }
}

const isAllowedRole = (req, iterable) => {
  if (!iterable.includes(req.user.role)) {
      throw new AppError(
        'Insufficient Permission',
        403,
        'INSUFFICIENT_PERMISSION'
    );
  }
}
export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    isUser(req);
    isAllowedRole(req, allowedRoles);
    next();
  };
};

export const authorizePermission = (...allowedRoles) => {
  return (req, res, next) => {
    
    isUser(req);
    isAllowedRole(req, allowedRoles);
    if (!req.user.can_create_election) {
      throw new AppError(
        'User doesnt have sufficient permission',
        403,
        'INSUFFICIENT_PERMISSION'
      );
    }

    next();
  }
}
