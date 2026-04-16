const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
//const xss = require('xss-clean');
const swaggerUi = require('swagger-ui-express');

const routes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');
const { apiLimiter, authLimiter } = require('./middlewares/rateLimit.middleware');
const swaggerSpec = require('./docs/swagger');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
//app.use(xss());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'API is running' });
});

// Protect application boundaries
app.use('/api', apiLimiter);
app.use('/api/v1/auth', authLimiter);
app.use('/api/v1', routes);

// 404 handler for invalid routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler must be last
app.use(errorMiddleware);

module.exports = app;
