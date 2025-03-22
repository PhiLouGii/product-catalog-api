const ProductRepository = require('../repositories/ProductRepository');

class ProductService {
  constructor() {
    this.repository = new ProductRepository();
  }

  async getAllProducts() {
    return await this.repository.findAll();
  }

  async createProduct(productData) {
    if (!productData.name || productData.price <= 0) {
      throw new Error('Invalid product data');
    }
    return await this.repository.create(productData);
  }
}
module.exports = ProductService;