require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cookieParser = require('cookie-parser');

// Route imports
const productRoutes = require('./src/routes/productRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const inventoryRoutes = require('./src/routes/inventoryRoutes');
const reportRoutes = require('./src/routes/reportRoutes');

// Initialize Express
const app = express();

// Database connection
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Catalog API',
      version: '1.0.0',
      description: 'API for managing e-commerce products',
    },
    servers: [{ url: 'http://localhost:5001' }],
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            category: { type: 'string' },
            variants: {
              type: 'array',
              items: { $ref: '#/components/schemas/Variant' }
            }
          }
        },
        Variant: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            sku: { type: 'string' },
            price: { type: 'number' },
            inventory: { type: 'number' },
            attributes: {
              type: 'object',
              properties: {
                size: { type: 'string' },
                color: { type: 'string' }
              }
            }
          }
        },
        Category: {
          type: 'object',
          properties: {
            name: { 
              type: 'string',
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
            message: { type: 'string' }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reports', reportRoutes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Server initialization
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API documentation: http://localhost:${PORT}/api-docs`);
});