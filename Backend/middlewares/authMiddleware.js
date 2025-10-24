const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const { User, Role, Access } = require('../models');

exports.protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Missing or malformed authorization header');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: ['id', 'name'],
          through: { attributes: [] },
          include: [
            {
              model: Access,
              as: 'accesses',
              attributes: ['id', 'name'],
              through: { attributes: [] }
            }
          ]
        }
      ]
    });

    if (!user) {
      logger.warn('Token decoded but no user found', { userId: decoded.id });
      return res.status(401).json({ message: 'Not authorized, token invalid' });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.warn('JWT verification failed', { reason: error.message });
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

exports.authorize = (...accesses) => {
  return (req, res, next) => {
    if (!req.user) {
      logger.warn('Authorization middleware invoked without user context');
      return res.status(401).json({ message: 'Not authorized' });
    }

    const userRoles = Array.isArray(req.user.roles) ? req.user.roles : [];
    const userAccesses = userRoles
      .flatMap((role) => (role.accesses || []).map((access) => access.name));
    const hasAccess = accesses.every((access) => userAccesses.includes(access));

    if (!hasAccess) {
      logger.warn('Access denied', { userId: req.user.id, requiredAccesses: accesses });
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }

    next();
  };
};
