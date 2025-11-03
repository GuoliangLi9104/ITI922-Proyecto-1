const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String }, // ⚠️ vulnerable a XSS si se muestra sin sanitizar
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  image: { type: String, default: 'https://via.placeholder.com/150' },
  category: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', ProductSchema);
