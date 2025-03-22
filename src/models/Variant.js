const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    attributes: {
      // For storing attributes like size, color, etc.
      type: Map,
      of: String,
      default: {},
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
    compareAtPrice: {
      type: Number,
      min: [0, 'Compare at price cannot be negative'],
      default: null,
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: [0, 'Stock quantity cannot be negative'],
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: [0, 'Low stock threshold cannot be negative'],
    },
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative'],
    },
    dimensions: {
      length: {
        type: Number,
        min: [0, 'Length cannot be negative'],
      },
      width: {
        type: Number,
        min: [0, 'Width cannot be negative'],
      },
      height: {
        type: Number,
        min: [0, 'Height cannot be negative'],
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          default: '',
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Virtual for discount percentage
VariantSchema.virtual('discountPercentage').get(function () {
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  }
  return 0;
});

// Virtual to indicate if an item is low in stock
VariantSchema.virtual('isLowStock').get(function () {
  return this.stockQuantity <= this.lowStockThreshold;
});

// Index for efficient querying
VariantSchema.index({ product: 1 });
VariantSchema.index({ sku: 1 });
VariantSchema.index({ isActive: 1 });
VariantSchema.index({ stockQuantity: 1 });

module.exports = mongoose.model('Variant', VariantSchema);