# **Product Catalog API**  

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.x-brightgreen)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/express-4.x-blue)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green)](https://www.mongodb.com/)

## **📁Project Overview**  
The **Product Catalog API** is a comprehensive RESTful API designed to support e-commerce platforms by providing robust endpoints for managing products, categories, inventory, and reporting. 

Built with **Node.js, Express, and MongoDB,** this API enables users to efficiently perform CRUD operations on products and categories while ensuring seamless inventory management and insightful reporting.

---

## **✨Features**
- Full CRUD operations for products/categories
- Product variants (sizes, colours) management
- Inventory tracking with low-stock alerts
- Advanced search with filters
- Discount pricing support
- Comprehensive API documentation

---

## **🛠️Technologies**  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose ORM)  
- **API Testing:** Postman  
- **Development Tools:** Nodemon, dotenv
- Swagger/OpenAPI 

---
## **🚀Getting Started**
### Prerequisites
- Node.js v18+
- MongoDB Atlas Account
- Postman

## **⚙️Installation**
### **1️. Clone the Repository**  
```bash
git https://github.com/your-username/product-catalog-api.git
cd product-catalog-api
```

### **2️. Install Dependencies**  
```bash
npm install
```

### **3️. Configure Environment Variables**  
Create a `.env` file in the root directory and add:  
```
MONGO_URI=mongodb://localhost:27017/product-catalog
PORT=5001
```

### **4️. Start the Server**  
```bash
npm start
```
---
## 📑API Documentation
Interactive documentation is available at:
```http://localhost:5001/api-docs```

---

## **🕸️API Endpoints**  

### **Category Endpoints**  
| Method | Endpoint                | Description                 |
|--------|-------------------------|-----------------------------|
| POST   | `/api/categories`       | Create a new category       |
| GET    | `/api/categories`       | Get all categories          |
| GET    | `/api/categories/:id`   | Get a single category       |
| PUT    | `/api/categories/:id`   | Update a category           |
| DELETE | `/api/categories/:id`   | Delete a category           |

### **Product Endpoints**  
| Method | Endpoint                | Description                 |
|--------|-------------------------|-----------------------------|
| POST   | `/api/products`         | Create a new product        |
| GET    | `/api/products`         | Get all products            |
| GET    | `/api/products/:id`     | Get a single product        |
| GET    | `/api/products/search`  | Search products             |
| PUT    | `/api/products/:id`     | Update a product            |
| DELETE | `/api/products/:id`     | Delete a product            |

---

## **💡Example API Requests**  
POST /products
Content-Type: application/json 
```json
{
  "name": "Wireless Headphones",
  "price": 199.99,
  "categories": ["64a1b2c3d4e5f6a7b8c9d0e1"],
  "variants": [
    {
      "name": "Black",
      "sku": "HP-BLK-001",
      "price": 199.99,
      "inventory": 50,
      "attributes": {
        "color": "black"
      }
    }
  ]
}
```
✅ Response: `201 Created`
```json
{
  "_id": "64cb13d8f3a7d62a8872a3f2",
  "name": "Wireless Headphones",
  "price": 199.99,
  "variants": [...],
  "createdAt": "2023-08-01T12:34:56.789Z"
}
```

### Search Products
```GET /products/search?q=wireless&minPrice=150&maxPrice=250```

✅ Response:
```json
[
  {
    "_id": "64cb13d8f3a7d62a8872a3f2",
    "name": "Wireless Headphones",
    "price": 199.99,
    "finalPrice": 199.99
  }
]
```
### Get Low Stock Report
```curl -X GET "http://localhost:5001/api/reports/low-stock?threshold=5"```

❗Error Response Example:
```json
{
  "success": false,
  "error": {
    "code": 400,
    "message": "Invalid price range"
  }
}
```
---
## 🧪Testing
Run test suite:
```bash
npm test
```
---


## **📂 Project Structure**  
```
📦 product-catalog-api
│── node_modules
│── src
│   ├── models            # Mongoose schemas
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Inventory.js
│   │   ├── User.js
│   │   ├── Variant.js
│   ├── routes            # API routes
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── inventoryRoutes.js
│   │   ├── reportRoutes.js
│   ├── controllers       # Business logic for API endpoints
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── inventoryController.js
│   │   ├── reportController.js
│   ├── middlewares       # Middleware functions
│   │   ├── errorHandler.js
│   │   ├── response.js
│   │   ├── upload.js
│   │   ├── validateRequest.js
│   ├── utils
│   │   ├── errors.js
│   │   ├── helpers.js
│   │   ├── validators.js       
│   ├── config            # Database connection setup
│   │   ├── db.js
│   ├── app.js            # Express app setup
│── .env                  # Environment variables
│── server.js             # Main entry point
│── package.json          # Dependencies & scripts
│── README.md             # Project documentation
```

---

## 🛑Assumptions & Limitations
### Assumptions
1. All prices are stored in GBP
2. Product variants share the base product's categories
3. Discounts apply to the base product price only
4. Inventory tracking is at variant level only

### Limitations
1. Search is case-sensitive
2. No transaction history tracking

---

## ❌Error Handling
The API uses standard HTTP status codes:

200: Success
201: Created
400: Bad Request
401: Unauthorized
403: Forbidden
404: Not Found
500: Internal Server Error

All errors return a consistent format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

## **📞 Contact**  
For questions or contact:  
📧 Email: p.giibwa@alustudent.com  
🔗 GitHub: [PhiLouGii](https://github.com/PhiLouGii/product-catalog-api.git)  
