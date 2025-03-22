const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  price: Number,
  variants: [{
    name: String,
    sku: {
      type: String,
      unique: true
    },
    price: Number,
    inventory: Number,
    attributes: {
      size: String,
      color: String
    }
  }],
  discount: {
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    },
    value: {
      type: Number,
      min: 0
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);