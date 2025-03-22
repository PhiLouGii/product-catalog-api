const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    price: Number,
    variants: [{ size: String, color: String, stock: Number }],
    inventory: { type: Number, default: 0 }
});
module.exports = mongoose.model('Product', ProductSchema);
