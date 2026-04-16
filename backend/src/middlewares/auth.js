import AppError from '../utils/handlers/response_handler.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;


    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        'Authentication token is required',
        401,
        'AUTH_TOKEN_REQUIRED'
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    req.user = decoded;
    next();

  } catch (err) {
    next(new AppError(
      err.message,
      401,
      err.message || 'INVALID_AUTH_TOKEN'
    ));
  }
};

const requireUser = (req) => {
  if (!req.user) {
      throw new AppError(
        'Request User are Required', 
        401,
        'REQUEST_USER_ARE_EMPTY'
    );
  }
};

const checkRole = (req, iterable) => {
  if (!iterable.includes(req.user.role)) {
      throw new AppError(
        'Insufficient Permission',
        403,
        'INSUFFICIENT_PERMISSION'
    );
  }
};

const hasPermission = (req, permissions) => {
  const userPermissions = req.user.permissions || [];
  
  const hasAll = permissions.every(p => userPermissions.includes(p));

  if (!hasAll) {
    throw new AppError(
      'Insufficient Permission',
      403,
      'INSUFFICIENT_PERMISSION'
    );
  }
};

export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    requireUser(req);
    //checkRole(req, allowedRoles);
    next();
  };
};

export const authorizeAccess = (allowedRoles, permissions) => {
  return (req, res, next) => {
    requireUser(req);
    checkRole(req, allowedRoles);
    if (req.user == "USER") {
      hasPermission(req, permissions);
    };
    next();
  }
};
