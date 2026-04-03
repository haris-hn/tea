const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  origin: { type: String },
  flavor: [{ type: String }],
  images: [{ type: String }],
  steepingInstructions: {
    servingSize: { type: String, default: "1-2 tsp per cup" },
    waterTemp: { type: String, default: "100°C" },
    steepingTime: { type: String, default: "3-5 minutes" },
    color: { type: String, default: "Golden" }
  },
  details: {
    qualities: [{ type: String }],
    caffeine: [{ type: String }],
    allergens: [{ type: String }],
    ingredients: { type: String }
  },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  variants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Variant' }],
  organic: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
