# **Product Catalog API**  

## **📁Project Overview**  
The **Product Catalog API** is a comprehensive RESTful API designed to support e-commerce platforms by providing robust endpoints for managing products, categories, inventory, and reporting. 

Built with **Node.js, Express, and MongoDB,** this API enables users to efficiently perform CRUD operations on products and categories while ensuring seamless inventory management and insightful reporting.

---

## **📜 Features**  
✅ **Product Management** – CRUD operations for products  
✅ **Category Management** – Organize products into categories  
✅ **RESTful API Design** – Follows best API design practices  
✅ **MongoDB Integration** – Uses Mongoose for data handling  
✅ **Middleware Support** – Error handling with custom middleware  

---

## **🛠️ Tech Stack**  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose ORM)  
- **API Testing:** Thunder Client / Postman  
- **Development Tools:** Nodemon, dotenv  

---

## **🚀 Installation & Setup**  

### **1️⃣ Clone the Repository**  
```bash
git https://github.com/your-username/product-catalog-api.git
cd product-catalog-api
```

### **2️⃣ Install Dependencies**  
```bash
npm install
```

### **3️⃣ Configure Environment Variables**  
Create a `.env` file in the root directory and add:  
```
MONGO_URI=mongodb://localhost:27017/product-catalog
PORT=5001
```

### **4️⃣ Start the Server**  
```bash
npm run dev
```
✅ Server runs on **http://localhost:5001**  

---

## **📂 Project Structure**  
```
📦 product-catalog-api
│── node_modules
│── src
│   ├── models            # Mongoose schemas
│   │   ├── Product.js
│   │   ├── Category.js
│   ├── routes            # API routes
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   ├── controllers       # Business logic for API endpoints
│   │   ├── productController.js
│   │   ├── categoryController.js
│   ├── middlewares       # Middleware functions
│   │   ├── errorHandler.js
│   ├── config            # Database connection setup
│   │   ├── db.js
│   ├── app.js            # Express app setup
│── .env                  # Environment variables
│── server.js             # Main entry point
│── package.json          # Dependencies & scripts
│── README.md             # Project documentation
```

---

## **📝 API Documentation**
### Base URL
When running locally, the base URL is: ```http://localhost:5001/api```

## **📡 API Endpoints**  

### **🔹 Category Endpoints**  
| Method | Endpoint                | Description                 |
|--------|-------------------------|-----------------------------|
| POST   | `/api/categories`       | Create a new category       |
| GET    | `/api/categories`       | Get all categories          |
| GET    | `/api/categories/:id`   | Get a single category       |
| PUT    | `/api/categories/:id`   | Update a category           |
| DELETE | `/api/categories/:id`   | Delete a category           |

### **🔹 Product Endpoints**  
| Method | Endpoint                | Description                 |
|--------|-------------------------|-----------------------------|
| POST   | `/api/products`         | Create a new product        |
| GET    | `/api/products`         | Get all products            |
| GET    | `/api/products/:id`     | Get a single product        |
| PUT    | `/api/products/:id`     | Update a product            |
| DELETE | `/api/products/:id`     | Delete a product            |

---

## **📊 Example API Requests**  

### **1️⃣ Create a Product (POST)**
**URL:** `http://localhost:5001/api/products`  
**Body (JSON):**  
```json
{
  "name": "Laptop",
  "price": 1200,
  "description": "A high-performance laptop",
  "category": "Electronics"
}
```
✅ Response: `201 Created`

---

## **🛠️ Challenges & Solutions**  

### **🔸 Issue: MongoDB Connection Error**
**Solution:**  
- Ensure MongoDB is installed and running  
- Verify `MONGO_URI` in `.env` file  

### **🔸 Issue: Data Not Saving in Database**
**Solution:**  
- Ensure the request is sending **JSON format**  
- Add `console.log(req.body)` in controllers to debug
- Check The Method used if is correct one 

---

## **📜 License**  
This project is licensed under the **MIT License**.  

---

## **📞 Contact**  
For questions or contact:  
📧 Email: p.giibwa@alustudent.com  
🔗 GitHub: [PhiLouGii](https://github.com/PhiLouGii/product-catalog-api.git)  
