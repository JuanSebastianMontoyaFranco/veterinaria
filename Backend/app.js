require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const logger = require('./config/logger');
const db = require('./models');

const app = express();

app.disable('x-powered-by');

// Core middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(morgan('combined', { stream: logger.stream }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/owners', require('./routes/ownerRoutes'));
app.use('/api/pets', require('./routes/petRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));

// Fallback handlers
app.use(require('./middlewares/notFound'));
app.use(require('./middlewares/errorHandler'));

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    logger.info('Database connection established');

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Database connection failed', { error: error.message });
    process.exit(1);
  }
};

startServer();

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection detected', {
    reason: reason instanceof Error ? reason.message : reason
  });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception detected', { error: error.message });
  process.exit(1);
});

module.exports = app;
