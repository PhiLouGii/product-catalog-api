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
const { successHandler } = require('./src/middlewares/response');

// Route imports
const productRoutes = require('./src/routes/productRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const inventoryRoutes = require('./src/routes/inventoryRoutes');
const reportRoutes = require('./src/routes/reportRoutes');

// Initialize Express
const app = express();

// Database connection
connectDB();

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

// Enhanced Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Catalog API',
      version: '1.0.0',
      description: 'Robust API for managing e-commerce products and inventory',
      contact: {
        name: 'API Support',
        email: 'support@productcatalog.com'
      }
    },
    servers: [{ 
      url: process.env.API_BASE_URL || 'http://localhost:5001',
      description: process.env.NODE_ENV === 'production' 
        ? 'Production server' 
        : 'Development server'
    }],
    components: {
      schemas: {
        Product: {
          type: 'object',
          required: ['name', 'price'],
          properties: {
            name: { 
              type: 'string',
              example: "Premium Wireless Headphones" 
            },
            description: { 
              type: 'string',
              example: "Noise-cancelling Bluetooth headphones" 
            },
            price: { 
              type: 'number',
              minimum: 0,
              example: 299.99
            },
            category: { 
              type: 'string',
              format: 'mongoId',
              example: "64a1b2c3d4e5f6a7b8c9d0e1"
            },
            variants: {
              type: 'array',
              items: { 
                $ref: '#/components/schemas/Variant' 
              }
            }
          }
        },
        Variant: {
          type: 'object',
          required: ['name', 'sku', 'price'],
          properties: {
            name: { 
              type: 'string',
              example: "Midnight Black" 
            },
            sku: { 
              type: 'string',
              uniqueItems: true,
              example: "WH-MB-2023" 
            },
            price: { 
              type: 'number',
              minimum: 0,
              example: 299.99
            },
            inventory: { 
              type: 'number',
              minimum: 0,
              example: 50 
            },
            attributes: {
              type: 'object',
              properties: {
                size: { 
                  type: 'string',
                  example: "One Size" 
                },
                color: { 
                  type: 'string',
                  example: "Black" 
                }
              }
            }
          }
        },
        Category: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { 
              type: 'string',
              uniqueItems: true,
              example: "Electronics" 
            },
            description: { 
              type: 'string',
              example: "Electronic devices and gadgets" 
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            statusCode: { type: 'number' },
            message: { type: 'string' },
            stack: { type: 'string' }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme'
        }
      }
    }
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reports', reportRoutes);

// Swagger documentation
app.use('/api-docs', 
  swaggerUi.serve, 
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'Product Catalog API Docs'
  })
);

// Response standardization middleware
app.use(successHandler);

// 404 handler
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// Global error handler
app.use(errorHandler);

// Server initialization
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

module.exports = server;