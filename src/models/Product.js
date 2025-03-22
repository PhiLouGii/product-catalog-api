const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Variant name is required'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    index: true
  },
  price: {
    type: Number,
    required: [true, 'Variant price is required'],
    min: [0, 'Price cannot be negative']
  },
  inventory: {
    type: Number,
    required: [true, 'Inventory count is required'],
    min: [0, 'Inventory cannot be negative']
  },
  attributes: {
    size: String,
    color: {
      type: String,
      required: [true, 'Color attribute is required'],
      trim: true
    }
  }
});

const discountSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: {
      values: ['percentage', 'fixed'],
      message: 'Discount type must be either "percentage" or "fixed"'
    }
  },
  value: {
    type: Number,
    min: [0, 'Discount value cannot be negative']
  }
});

// Discount validation
discountSchema.path('type').validate(function(value) {
  if (value && !this.value) return false;
  if (!value && this.value) return false;
  return true;
}, 'Both discount type and value must be provided together');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters'],
    index: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'At least one category is required']
  }],
  price: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Price cannot be negative']
  },
  variants: [variantSchema],
  discount: discountSchema
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
productSchema.index({ 'variants.sku': 1 }, { unique: true, sparse: true });
productSchema.index({
  name: 'text',
  description: 'text',
  'variants.attributes.color': 'text'
}, {
  weights: {
    name: 5,
    description: 2,
    'variants.attributes.color': 1
  },
  name: 'product_search_index'
});

// Virtuals
productSchema.virtual('finalPrice').get(function() {
  if (!this.discount || !this.discount.type || !this.discount.value) {
    return this.price;
  }
  
  return this.discount.type === 'percentage' 
    ? this.price * (1 - this.discount.value/100)
    : this.price - this.discount.value;
});

module.exports = mongoose.model('Product', productSchema);