const mongoose = require('mongoose');

const InventoryTransactionSchema = new mongoose.Schema(
  {
    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Variant',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    type: {
      type: String,
      enum: ['stock_in', 'stock_out', 'adjustment', 'returned'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    previousQuantity: {
      type: Number,
      required: true,
    },
    newQuantity: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      trim: true,
    },
    referenceNumber: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: String,
      default: 'system',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
InventoryTransactionSchema.index({ variant: 1 });
InventoryTransactionSchema.index({ product: 1 });
InventoryTransactionSchema.index({ type: 1 });
InventoryTransactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('InventoryTransaction', InventoryTransactionSchema);