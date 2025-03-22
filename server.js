require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./src/config/db');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { ApiError, errorHandler } = require('./src/utils/errors');
const responseMiddleware = require('./src/middlewares/response');
const successResponse = responseMiddleware.successResponse;
const errorResponse = responseMiddleware.errorResponse;

// Initialize Express 
const app = express();

// Database connection
connectDB();

// Response middleware setup
app.use((req, res, next) => {
  res.success = (data, statusCode) => successResponse(res, data, statusCode);
  res.error = (error, statusCode) => errorResponse(res, error, statusCode);
  next();
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

// Application middleware
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use('/api/', apiLimiter);

// Swagger configuration (keep your existing setup)
// ... [your existing swagger code] ...

// Routes
app.use('/api/products', require('./src/routes/productRoutes'));
app.use('/api/categories', require('./src/routes/categoryRoutes'));
app.use('/api/inventory', require('./src/routes/inventoryRoutes'));
app.use('/api/reports', require('./src/routes/reportRoutes'));

// Swagger documentation
app.use('/api-docs', 
  swaggerUi.serve, 
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'Product Catalog API Docs'
  })
);

// 404 handler
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// Global error handler (MUST BE LAST MIDDLEWARE)
app.use(errorHandler);

// Server initialization
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

module.exports = server;