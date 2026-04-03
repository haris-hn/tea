const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  sku: { type: String, required: true, unique: true },
  sizeOrWeight: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Variant', variantSchema);
