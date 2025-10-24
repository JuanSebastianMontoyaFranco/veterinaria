'use strict';

const logger = require('../config/logger');

module.exports = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  logger.error('Unhandled error caught', {
    method: req.method,
    path: req.originalUrl,
    message: err.message,
    stack: err.stack
  });

  let statusCode = err.status || 500;
  let message = err.message || 'Internal server error';
  let details;

  switch (err.name) {
    case 'SequelizeValidationError':
    case 'SequelizeUniqueConstraintError':
      statusCode = err.name === 'SequelizeUniqueConstraintError' ? 409 : 422;
      details = err.errors?.map((error) => ({
        field: error.path,
        message: error.message
      }));
      message = 'Database validation failed';
      break;
    case 'SequelizeForeignKeyConstraintError':
      statusCode = 400;
      message = 'Referenced resource not found';
      break;
    default:
      break;
  }

  res.status(statusCode).json({
    message,
    ...(details ? { errors: details } : {})
  });
};
