'use strict';

const { validationResult } = require('express-validator');
const logger = require('../config/logger');

module.exports = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map((error) => ({
    field: error.param,
    message: error.msg
  }));

  logger.warn('Request validation failed', {
    path: req.originalUrl,
    errors: extractedErrors
  });

  res.status(422).json({
    message: 'Invalid request data',
    errors: extractedErrors
  });
};
