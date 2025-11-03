const { Product } = require('../models');

// Crear producto (sin validaciones)
exports.createProduct = async (data) => {
  const product = new Product(data);
  return await product.save();
};

// Listar productos (⚠️ Vulnerabilidad OWASP A03: posible inyección NoSQL)
exports.getProducts = async (filters) => {
  return await Product.find(filters);
};

// Actualizar producto
exports.updateProduct = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

// Eliminar producto
exports.deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};
